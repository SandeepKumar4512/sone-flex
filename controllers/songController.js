const Song = require("../models/song");

// Get all songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Trending songs
const getTrendingSongs = async (req, res) => {
  try {
    const songs = await Song.find().limit(5);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Songs by category
const getSongsByCategory = async (req, res) => {
  try {
    const songs = await Song.find({ category: req.params.category });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Songs by language
const getSongsByLanguage = async (req, res) => {
  try {
    const songs = await Song.find({ language: req.params.language });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload song
const uploadSong = async (req, res) => {
  try {
    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      language: req.body.language,
      category: req.body.category,
      audio_file: req.files.audio[0].path,
      cover_image: req.files.cover[0].path
    });

    await song.save();

    res.json({
      message: "Song uploaded successfully",
      song
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllSongs,
  getTrendingSongs,
  getSongsByCategory,
  getSongsByLanguage,
  uploadSong
};
