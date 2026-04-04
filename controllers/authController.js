// Temporary demo controller
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  // Generate OTP (demo)
  const otp = "123456";
  res.json({ success: true, otp });
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (otp === "123456") {
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: "Logged out" });
};
