const express = require("express");
const router = express.Router();

// Controller import करो
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
// Routes
router.get("/profile", getUserProfile);   // GET profile
router.put("/update", updateUserProfile); // PUT update
module.exports = router;
