const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  user_phone: String,
  song_id: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
