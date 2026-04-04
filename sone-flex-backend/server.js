const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "soneflexsecret";
mongoose.connect("mongodb+srv://SanjitKumar:gf3RvmRqL2wArBhh@cluster0.epufnx6.mongodb.net/soneflex?retryWrites=true&w=majority")
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log(err));
/* USER */
const User = mongoose.model("User", {
  email: String,
  password: String
});

/* SONG */
const Song = mongoose.model("Song", {
  title: String,
  artist: String,
  language: String,
  category: String,
  cover_image: String,
  audio_file: String
});

/* PLAYLIST */
const Playlist = mongoose.model("Playlist", {
  userId: String,
  songs: Array
});

/* REGISTER */
app.post("/api/register", async (req,res)=>{
  const user = await User.create(req.body);
  res.json(user);
});

/* LOGIN */
app.post("/api/login", async (req,res)=>{
  const user = await User.findOne(req.body);

  if(!user) return res.status(401).send("Invalid");

  const token = jwt.sign({id:user._id}, SECRET);
  res.json({token});
});

/* AUTH */
function auth(req,res,next){
  try{
    const token = req.headers.authorization;
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  }catch{
    res.status(401).send("Unauthorized");
  }
}

/* SONG API */
app.get("/api/songs", async (req,res)=>{
  const songs = await Song.find();
  res.json(songs);
});

/* PLAYLIST SAVE */
app.post("/api/playlist", auth, async (req,res)=>{
  const list = await Playlist.create({
    userId: req.user.id,
    songs: req.body.songs
  });
  res.json(list);
});

/* PLAYLIST GET */
app.get("/api/playlist", auth, async (req,res)=>{
  const list = await Playlist.findOne({userId:req.user.id});
  res.json(list || {songs:[]});
});

/* START */
app.listen(5000, ()=>console.log("Server Running 🚀"));
