// checkSongsFullDebugAuto.js
require("dotenv").config();
const mongoose = require("mongoose");

// Command-line से password लेना
const password = process.argv[2];
if (!password) {
    console.error("❌ कृपया MongoDB password command line में डालो!");
    console.error("Usage: node checkSongsFullDebugAuto.js <your_password>");
    process.exit(1);
}

// Mongo URI बनाओ
const MONGO_URI = `mongodb+srv://SanjitKumar:${password}@cluster0.epufnx6.mongodb.net/soneflexdb?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
.then(async () => {
    console.log("✅ MongoDB connected");

    const db = mongoose.connection.db;

    // सभी collections लिस्ट करना
    const collections = await db.listCollections().toArray();
    console.log("🔹 Collections in DB:");
    collections.forEach(col => console.log("-", col.name));

    // हर collection में documents count और first 5 records दिखाना
    for (let col of collections) {
        const documents = await db.collection(col.name).find().limit(5).toArray();
        console.log(`\n📁 Collection: ${col.name}`);
        console.log("Total documents:", await db.collection(col.name).countDocuments());
        console.log("First 5 documents preview:", documents);
    }

    process.exit(0);
})
.catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
