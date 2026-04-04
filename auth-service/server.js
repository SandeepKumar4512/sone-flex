const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/soneflex")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  token: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

// OTP request
app.post("/api/request-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ msg: "Phone required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(`OTP for ${phone}: ${otp}`);

  let user = await User.findOne({ phone });
  if (!user) user = new User({ phone });

  await user.save();

  res.json({ msg: "OTP sent", otp });
});

// Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { phone } = req.body;

  const token = jwt.sign({ phone }, "secretkey", { expiresIn: "7d" });

  await User.findOneAndUpdate({ phone }, { token });

  res.json({ msg: "OTP verified", token });
});

// Start server (IMPORTANT: last में होना चाहिए)
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
