const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, logout } = require("../controllers/authController");

// Send OTP
router.post("/send-otp", sendOtp);
// Verify OTP
router.post("/verify-otp", verifyOtp);
// Logout
router.post("/logout", logout);
module.exports = router;
