const express = require("express");
const router = express.Router();
const { streamSong } = require("../controllers/streamController");

router.get("/:song_id", streamSong);
module.exports = router;
