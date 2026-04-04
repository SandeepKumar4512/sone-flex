// checkAllSongsFullAuto.js
require("dotenv").config();
const mongoose = require("mongoose");

// Command line से password लेना
const password = process.argv[2];
if (!password) {
    console.error("❌ कृपया MongoDB password command line में डालो!");
    process.exit(1);
}

// Mongo URI तैयार करना
const MONGO_URI = `mongodb+srv://SanjitKumar:${password}@cluster0.epufnx6.mongodb.net/soneflexdb?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log("✅ MongoDB connected\n");

    const db = mongoose.connection.db;

    // सभी collections list करना
    const collections = await db.listCollections().toArray();
    console.log("🔹 Collections in DB:");
    collections.forEach(col => console.log("-", col.name));

    // हर collection में documents count और preview दिखाना
    for (let col of collections) {
        const documents = await db.collection(col.name).find().limit(10).toArray();
        console.log(`\n📁 Collection: ${col.name}`);
        console.log("Total documents:", await db.collection(col.name).countDocuments());
        console.log("First 10 documents preview:", documents);
    }

    console.log("\n🎵 Check complete!");
    process.exit(0);
})
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
