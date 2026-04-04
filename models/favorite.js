const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({

  user: {
    type: String,
    required: true
  },

  song_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.models.Favorite ||
mongoose.model("Favorite", favoriteSchema);
