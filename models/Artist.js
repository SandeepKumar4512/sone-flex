// models/Artist.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  cover: {
    type: String, // प्रोफाइल फोटो
    default: "default-profile.png"
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song" // यह हर आर्टिस्ट के गानों की लिस्ट रखेगा
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔒 पासवर्ड हैश करना
ArtistSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🗝️ पासवर्ड चेक करने के लिए
ArtistSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Artist", ArtistSchema);
