const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({

  title: { type: String, required: true },

  artist: { type: String, required: true },

  language: { type: String },

  category: { type: String },

  cover_image: { type: String },

  audio_file: { type: String },

  plays: {
    type: Number,
    default: 0
  },

  created_at: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.models.Song ||
mongoose.model("Song", songSchema);
