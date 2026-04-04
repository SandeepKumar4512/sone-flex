require('dotenv').config();  
const express = require('express');  
const mongoose = require('mongoose');  
const cors = require('cors');  
const jwt = require('jsonwebtoken');  
const fs = require('fs');  
const path = require('path');  
  
// Redis client  
const redis = require('redis');  
const redisClient = redis.createClient({  
    url: 'redis://127.0.0.1:6379',  
    legacyMode: true  
});  
redisClient.connect().then(() => console.log('✅ Redis connected'))  
    .catch(err => console.error('❌ Redis connection error:', err));  
  
/* =========================  
MODELS  
========================= */  
const userSchema = new mongoose.Schema({  
  phone: String,  
  name: String,  
  email: String,  
  favorites: [String],  
  recentlyPlayed: [String]  
});  
const User = mongoose.model("User", userSchema);  
  
const songSchema = new mongoose.Schema({  
  title: String,  
  artist: String,  
  url: String,  
  cover: String,  
  plays: { type: Number, default: 0 }  
});  
const Song = mongoose.model("Song", songSchema);  
  
/* =========================  
EXPRESS SETUP  
========================= */  
const app = express();  
const PORT = process.env.PORT || 5000;  
  
app.use(cors());  
app.use(express.json());  
app.use(express.static("public"));  
app.use("/uploads", express.static("uploads"));  
  
/* =========================  
AUTH ROUTES (OTP LOGIN)  
========================= */  
const authRouter = express.Router();  
  
authRouter.post('/send-otp', async (req, res) => {  
    const { phone } = req.body;  
    if (!phone) return res.status(400).json({ success: false, message: "Phone missing ❌" });  
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  
    try {  
        await redisClient.setEx(phone, 300, otp);  
        console.log(`💌 OTP for ${phone}: ${otp}`);  
        res.json({ success: true, message: `OTP sent successfully ✅`, otp_preview: otp });  
    } catch (err) {  
        res.status(500).json({ success: false, message: 'Error sending OTP ❌', error: err.message });  
    }  
});  
  
authRouter.post('/verify-otp', async (req, res) => {  
    const { phone, otp } = req.body;  
    if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone or OTP missing ❌" });  
  
    try {  
        const storedOtp = await redisClient.get(phone);  
        if (!storedOtp) return res.status(400).json({ success: false, message: 'OTP expired ❌' });  
        if (storedOtp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP ❌' });  
  
        let user = await User.findOne({ phone });  
        if (!user) {  
            user = new User({ phone, name: 'Sanjit Kumar', email: '' });  
            await user.save();  
        }  
  
        const token = jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET || "secretkey", { expiresIn: '7d' });  
  
        res.json({ success: true, message: `Login success ✅ Welcome, ${user.name}`, user, token });  
    } catch (err) {  
        res.status(500).json({ success: false, message: 'Error verifying OTP ❌', error: err.message });  
    }  
});  
  
app.use("/api/auth", authRouter);  
  
/* =========================  
SONG ROUTES  
========================= */  
const songRouter = express.Router();  
  
songRouter.get("/", async (req, res) => {  
    try {  
        const cached = await redisClient.get("all_songs");  
        if (cached) return res.json(JSON.parse(cached));  
  
        const songs = await Song.find();  
        await redisClient.setEx("all_songs", 60, JSON.stringify(songs));  
        res.json({ success: true, message: "Songs fetched ✅", songs });  
    } catch (err) {  
        res.status(500).json({ success: false, message: "Error fetching songs ❌", error: err.message });  
    }  
});  
  
songRouter.get("/stream/:id", async (req, res) => {  
    try {  
        const song = await Song.findById(req.params.id);  
        if (!song) return res.status(404).json({ success: false, message: "Song not found ❌" });  
  
        const filePath = path.join(__dirname, song.url);  
        const stat = fs.statSync(filePath);  
        const fileSize = stat.size;  
        const range = req.headers.range;  
  
        if (range) {  
            const parts = range.replace(/bytes=/, "").split("-");  
            const start = parseInt(parts[0], 10);  
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;  
            const chunksize = (end - start) + 1;  
            const file = fs.createReadStream(filePath, { start, end });  
            const head = {  
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,  
                'Accept-Ranges': 'bytes',  
                'Content-Length': chunksize,  
                'Content-Type': 'audio/mpeg',  
            };  
            res.writeHead(206, head);  
            file.pipe(res);  
        } else {  
            const head = {  
                'Content-Length': fileSize,  
                'Content-Type': 'audio/mpeg',  
            };  
            res.writeHead(200, head);  
            fs.createReadStream(filePath).pipe(res);  
        }  
  
        song.plays += 1;  
        await song.save();  
    } catch (err) {  
        res.status(500).json({ success: false, message: "Error streaming song ❌", error: err.message });  
    }  
});  
  
app.use("/api/songs", songRouter);  
  
/* =========================  
USER PROFILE ROUTES  
========================= */  
const profileRouter = express.Router();  
  
profileRouter.get("/:userId", async (req, res) => {  
    try {  
        const user = await User.findById(req.params.userId);  
        if (!user) return res.status(404).json({ success: false, message: "User not found ❌" });  
        res.json({ success: true, message: "Profile fetched ✅", user });  
    } catch (err) {  
        res.status(500).json({ success: false, message: "Error fetching profile ❌", error: err.message });  
    }  
});  
  
profileRouter.put("/update/:userId", async (req, res) => {  
    try {  
        const updates = req.body;  
        const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true });  
        res.json({ success: true, message: "Profile updated ✅", user });  
    } catch (err) {  
        res.status(500).json({ success: false, message: "Error updating profile ❌", error: err.message });  
    }  
});  
  
app.use("/api/profile", profileRouter);  
  
/* =========================  
MONGODB CONNECT  
========================= */  
mongoose.connect(process.env.MONGO_URI)  
    .then(() => console.log("MongoDB connected ✅"))  
    .catch(err => console.log(err));  
  
/* =========================  
DEFAULT ROUTE  
========================= */  
app.get("/", (req, res) => {  
    res.sendFile(__dirname + "/public/index.html");  
});  
  
/* =========================  
START SERVER  
========================= */  
app.listen(PORT, () => {  
    console.log(`Server running on port ${PORT} 🚀`);  
});
