const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ================= SCHEMA =================
const favoriteSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // user पहचान
  song_id: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
  created_at: { type: Date, default: Date.now }
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// ================= ADD FAVORITE =================
router.post("/add", async (req, res) => {
  try {
    const { user_id, song_id } = req.body;

    if (!user_id || !song_id) {
      return res.status(400).json({ message: "❌ user_id और song_id जरूरी है" });
    }

    // duplicate check
    const exists = await Favorite.findOne({ user_id, song_id });

    if (exists) {
      return res.json({ message: "⚠️ Already in favorites" });
    }

    const fav = new Favorite({ user_id, song_id });
    await fav.save();

    res.json({ message: "❤️ Added to favorites", fav });

  } catch (err) {
    res.status(500).json({ message: "❌ Error", error: err.message });
  }
});

// ================= GET FAVORITES =================
router.get("/:user_id", async (req, res) => {
  try {
    const data = await Favorite.find({ user_id: req.params.user_id })
      .populate("song_id");

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "❌ Error" });
  }
});

// ================= REMOVE FAVORITE =================
router.delete("/remove", async (req, res) => {
  try {
    const { user_id, song_id } = req.body;

    await Favorite.deleteOne({ user_id, song_id });

    res.json({ message: "🗑 Removed from favorites" });

  } catch (err) {
    res.status(500).json({ message: "❌ Error" });
  }
});

module.exports = router;
