const mongoose = require("mongoose");

// Song Schema
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }, // लाइव आर्टिस्ट प्रोफाइल लिंक
  audio_file: { type: String, required: true },
  cover_image: { type: String, required: true },
  category: { type: String, default: "Unknown" },  // जैसे Trending, Pop, LoFi आदि
  language: { type: String, default: "Hindi" },   // लाइव भाषा
  plays: { type: Number, default: 0 },            // प्ले काउंट
  created_at: { type: Date, default: Date.now }   // अपलोड टाइम
});

module.exports = mongoose.model("Song", SongSchema);
