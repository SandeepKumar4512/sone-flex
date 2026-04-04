const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// 🔥 MongoDB Atlas connect (अपना password डालो)
mongoose.connect("mongodb+srv://SanjitKumar:gf3RvmRqL2wArBhh@cluster0.epufnx6.mongodb.net/soneflex?retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,
  token: String
});

const User = mongoose.model("User", UserSchema);

// ✅ Song Schema
const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio_file: String,
  cover_image: String,
  plays: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const Song = mongoose.model("Song", SongSchema);

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// ✅ OTP Request
app.post("/api/request-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ msg: "Phone required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`OTP for ${phone}: ${otp}`);

  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone });
    await user.save();
  }

  res.json({ msg: "OTP sent", otp });
});

// ✅ OTP Verify
app.post("/api/verify-otp", async (req, res) => {
  const { phone } = req.body;

  const token = jwt.sign({ phone }, "secretkey", { expiresIn: "7d" });

  await User.findOneAndUpdate({ phone }, { token });

  res.json({ msg: "OTP verified", token });
});

// 🔐 Profile API
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, "secretkey");

    const user = await User.findOne({ phone: decoded.phone });

    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

// 🎵 Get all songs
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Error loading songs" });
  }
});

// 🎧 Play Song API
app.post("/api/play/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, "secretkey");

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    song.plays += 1;
    await song.save();

    res.json({
      msg: "Song played",
      user: decoded.phone,
      plays: song.plays
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
});

// ✅ Start server (हमेशा सबसे नीचे)
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
// 🔥 Trending Song (Top Played)
app.get("/api/trending-one", async (req, res) => {
  try {
    const song = await Song.findOne().sort({ plays: -1, created_at: -1 });
    res.json(song);
  } catch (err) {
    res.status(500).json({ msg: "Error loading trending song" });
  }
});
// 🏠 Home API (All in one)
app.get("/api/home", async (req, res) => {
  try {
    const trending = await Song.findOne().sort({ plays: -1 });

    const recommended = await Song.find().sort({ plays: -1 }).limit(5);

    const allSongs = await Song.find().limit(20);

    res.json({
      trending,
      recommended,
      allSongs
    });

  } catch (err) {
    res.status(500).json({ msg: "Error loading home data" });
  }
});
app.use("/uploads", express.static("uploads"));
const Favorite = require("./models/Favorite");
// ❤️ Add to favorite
app.post("/api/favorite", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "secretkey");

    const { song_id } = req.body;

    const fav = new Favorite({
      user_phone: decoded.phone,
      song_id
    });

    await fav.save();

    res.json({ msg: "Added to favorites" });

  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});

// ❤️ Get favorites
app.get("/api/favorites", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "secretkey");

    const favs = await Favorite.find({ user_phone: decoded.phone });

    res.json(favs);

  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});
// 📥 Download Song API
app.get("/api/download/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    jwt.verify(token, "secretkey");

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    const filePath = song.audio_file;

    res.download(filePath);

  } catch (err) {
    res.status(500).json({ msg: "Error downloading" });
  }
});
app.use(express.static(__dirname));
/* 🎧 STREAM SONG */
app.get("/api/songs/:id/stream", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).send("Song not found");

    const filePath = __dirname + "/" + song.audio_file;

    res.sendFile(filePath);

  } catch (err) {
    res.status(500).send("Server error");
  }
});app.use(express.static("public"));
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const songRoutes = require('./routes/songRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>console.log("MongoDB connected ✅"))
.catch(err=>console.log(err));

// Serve frontend
app.use(express.static("public"));

// Serve uploads
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api", songRoutes);

// Default route
app.get("/", (req,res)=>res.sendFile(__dirname+"/public/index.html"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT} 🚀`));
