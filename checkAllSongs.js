// checkAllSongs.js
require("dotenv").config();
const mongoose = require("mongoose");

// Mongo URI from .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ .env में MONGO_URI सेट नहीं है!");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db;

    // सभी collections लिस्ट करना
    const collections = await db.listCollections().toArray();
    console.log("🔹 Collections in DB:");
    collections.forEach(col => console.log("-", col.name));

    // Songs collection specially check करना
    const songsCollection = db.collection("songs");
    const totalSongs = await songsCollection.countDocuments();
    console.log(`\n🎵 Total songs in DB: ${totalSongs}`);

    const firstSongs = await songsCollection.find().limit(10).toArray();
    console.log("\n📄 First 10 songs preview:");
    firstSongs.forEach((song, i) => {
        console.log(`${i+1}. ${song.title || song["शीर्षक"]} - ${song.artist || song["कलाकार"]}`);
    });

    process.exit(0);
})
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
