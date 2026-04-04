const express = require("express");
const router = express.Router();
const { createPlaylist, addSong, getUserPlaylists } = require("../controllers/playlistController");

router.post("/create", createPlaylist);
router.post("/add-song", addSong);
router.get("/user", getUserPlaylists);
module.exports = router;
