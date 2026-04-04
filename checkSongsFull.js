require("dotenv").config();
const mongoose = require("mongoose");

// पासवर्ड .env से लो
const password = process.env.MONGO_PASSWORD;
if (!password) {
    console.error("❌ कृपया .env में MONGO_PASSWORD डालो!");
    process.exit(1);
}

// Mongo URI
const MONGO_URI = `mongodb+srv://SanjitKumar:${password}@cluster0.epufnx6.mongodb.net/soneflexdb?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("✅ MongoDB connected");
    return mongoose.connection.db.collection("songs").find().toArray();
})
.then(songs => {
    console.log("🎵 All songs in DB:");
    console.table(songs.map(s => ({ _id: s._id, title: s.title, artist: s.artist, plays: s.plays })));
    process.exit(0);
})
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
