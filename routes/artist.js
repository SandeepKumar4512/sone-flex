const express = require("express");
const router = express.Router();
const Artist = require("../models/Artist");

// 🔹 Auto create artist if not exists
router.post("/create", async (req, res) => {
  try {
    const { name, email, profilePic } = req.body; // आप चाहो तो प्रोफ़ाइल फोटो लिंक भी भेज सकते हो
    if (!name) return res.status(400).json({ message: "Artist name required" });

    let artist = await Artist.findOne({ name });
    if (!artist) {
      artist = await Artist.create({
        name,
        email: email || "",
        profilePic: profilePic || ""
      });
    }

    res.json(artist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Artist creation failed", error: err.message });
  }
});

module.exports = router;
