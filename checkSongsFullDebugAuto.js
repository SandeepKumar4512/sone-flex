require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db;

    const songs = await db.collection("songs").find().toArray();

    console.log(`\n🎵 Total songs: ${songs.length}\n`);

    songs.forEach((song, i) => {
        console.log(`${i+1}. ${song.title} - ${song.artist}`);
    });

    process.exit(0);
})
.catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});
