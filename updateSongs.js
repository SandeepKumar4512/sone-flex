const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected ✅"))
.catch(err=>console.log(err));

const Song = mongoose.model("Song", {
  language:String,
  category:String
});

/* 🔥 ALL LANGUAGES */
const languages = [
  "Hindi",
  "English",
  "Punjabi",
  "Bhojpuri",
  "Telugu",
  "Tamil",
  "Bengali",
  "Malayalam",
  "Gujarati",
  "Rajasthani",
  "Marathi",
  "Oriya",
  "Assamese",
  "Kannada",
  "Haryanvi"
];

/* 🔥 ULTRA PRO CATEGORIES (BIG APPS STYLE) */
const categories = [
  "Trending",
  "Top Charts",
  "New Releases",
  "Love",
  "Romantic",
  "Sad",
  "Heartbreak",
  "Party",
  "Dance",
  "Club",
  "LoFi",
  "Chill",
  "Workout",
  "Gym",
  "Motivation",
  "Focus",
  "Study",
  "Sleep",
  "Relax",
  "Devotional",
  "Bhakti",
  "Festival",
  "Desi Hits",
  "International",
  "Hip Hop",
  "Rap",
  "Pop",
  "Rock",
  "Indie",
  "Remix",
  "Mashup",
  "Old Classics",
  "90s Hits",
  "2000s Hits",
  "Sad LoFi",
  "Romantic LoFi",
  "Instrumental",
  "Background Music",
  "Trending Reels",
  "Viral Songs"
];

/* 🔥 UPDATE SCRIPT */
async function update(){
  const songs = await Song.find();

  for(let i=0; i<songs.length; i++){

    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    await Song.updateOne(
      { _id: songs[i]._id },
      {
        $set:{
          language: randomLang,
          category: randomCat
        }
      }
    );

    console.log(`Updated: ${songs[i]._id} → ${randomLang} / ${randomCat}`);
  }

  console.log("🔥 ALL SONGS FULLY UPDATED (PRO LEVEL) ✅");
  process.exit();
}

update();
