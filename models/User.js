const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true }, // OTP के लिए
  email: { type: String, default: "" },
  password: { type: String, default: "" },

  name: { type: String, default: "Sanjit Kumar" }, // default name
  avatar: { type: String, default: "" },
  city: { type: String, default: "" },

  otp: { type: String }, // OTP store करने के लिए
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
