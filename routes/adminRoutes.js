const express = require("express");
const router = express.Router();
const { uploadSong, addCategory, addBanner, getUsers } = require("../controllers/adminController");

router.post("/upload-song", uploadSong);
router.post("/category", addCategory);
router.post("/banner", addBanner);
router.get("/users", getUsers);
module.exports = router;
