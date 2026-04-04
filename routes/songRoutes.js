// routes/songRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const Song = require("../models/Song");
const Favorite = require("../models/Favorite");
const authMiddleware = require("../middleware/authMiddleware");

/* 🔐 SECRET */
const JWT_SECRET = "soneflex_secret";

// 🔹 Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 🎵 Get all songs (🔐 PROTECTED)
router.get("/songs", authMiddleware, async (req, res) => {
  console.log("🔥 USER:", req.user); // DEBUG

  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ msg: "Error loading songs", error: err.message });
  }
});

// 🎧 Play song (🔐 FIXED TOKEN)
router.post("/play/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized ❌" });

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ msg: "Song not found" });

    song.plays += 1;
    await song.save();

    res.json({
      msg: "Song played",
      user: req.user.phone,
      plays: song.plays
    });
  } catch (err) {
    res.status(500).json({ msg: "Error playing song", error: err.message });
  }
});

// ❤️ Add to favorite (🔐 FIXED)
router.post("/favorite", authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized ❌" });

    const { song_id } = req.body;

    const fav = new Favorite({
      user_phone: req.user.phone,
      song_id
    });

    await fav.save();
    res.json({ msg: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ msg: "Error adding favorite", error: err.message });
  }
});

// ❤️ Get favorites (🔐 FIXED)
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized ❌" });

    const favs = await Favorite.find({ user_phone: req.user.phone });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ msg: "Error loading favorites", error: err.message });
  }
});

// 📥 Download song (🔐 FIXED)
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized ❌" });

    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ msg: "Song not found" });

    res.download(song.audio_file);
  } catch (err) {
    res.status(500).json({ msg: "Error downloading song", error: err.message });
  }
});

// 🎧 Stream song (PUBLIC)
router.get("/songs/:id/stream", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).send("Song not found");

    const filePath = __dirname + "/../" + song.audio_file;
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send("Error streaming song: " + err.message);
  }
});

// 🔹 Upload song (🔐 PROTECTED)
router.post(
  "/songs/upload",
  authMiddleware,
  upload.fields([{ name: "audio" }, { name: "cover" }]),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ msg: "Unauthorized ❌" });

      const { title, artist, artistId, language, category } = req.body;

      if (!req.files.audio || !req.files.cover) {
        return res.status(400).json({ message: "Audio or Cover missing ❌" });
      }

      const audio_file = req.files.audio[0].path;
      const cover_image = req.files.cover[0].path;

      const song = await Song.create({
        title,
        artist,
        artistId,
        language,
        category,
        audio_file,
        cover_image
      });

      res.json({ message: "Song uploaded ✅", song });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload Failed ❌", error: err.message });
    }
  }
);

module.exports = router;
