const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected ✅"))
.catch(err=>console.log(err));

const SongSchema = new mongoose.Schema({
  title:String,
  artist:String,
  audio_file:String,
  cover_image:String,
  language:String,
  category:String
});

const Song = mongoose.model("Song", SongSchema);

/* 🔥 ALL LANGUAGES */
const languages = [
  "Hindi","English","Punjabi","Bhojpuri","Telugu","Tamil",
  "Bengali","Malayalam","Gujarati","Rajasthani","Marathi",
  "Oriya","Assamese","Kannada","Haryanvi"
];

/* 🔥 ALL PRO CATEGORIES */
const categories = [
  "Trending","Top Charts","New Releases","Love","Romantic","Sad","Heartbreak",
  "Party","Dance","Club","LoFi","Chill","Workout","Gym","Motivation",
  "Focus","Study","Sleep","Relax","Devotional","Bhakti","Festival",
  "Desi Hits","International","Hip Hop","Rap","Pop","Rock","Indie",
  "Remix","Mashup","Old Classics","90s Hits","2000s Hits",
  "Sad LoFi","Romantic LoFi","Instrumental","Background Music",
  "Trending Reels","Viral Songs"
];

/* 🔥 RANDOM PICK FUNCTION */
function random(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

async function addSongs(){

  await Song.insertMany([
    {
      title:"Love Song",
      artist:"Sanjit",
      audio_file:"uploads/song1.mp3",
      cover_image:"uploads/cover1.jpg",
      language: random(languages),
      category: random(categories)
    },
    {
      title:"Party Beat",
      artist:"DJ Flex",
      audio_file:"uploads/song2.mp3",
      cover_image:"uploads/cover2.jpg",
      language: random(languages),
      category: random(categories)
    },
    {
      title:"Sad Vibe",
      artist:"LoFi King",
      audio_file:"uploads/song3.mp3",
      cover_image:"uploads/cover3.jpg",
      language: random(languages),
      category: random(categories)
    },
    {
      title:"Desi Vibe",
      artist:"India Beats",
      audio_file:"uploads/song4.mp3",
      cover_image:"uploads/cover4.jpg",
      language: random(languages),
      category: random(categories)
    },
    {
      title:"South Power",
      artist:"South Star",
      audio_file:"uploads/song5.mp3",
      cover_image:"uploads/cover5.jpg",
      language: random(languages),
      category: random(categories)
    },
    {
      title:"LoFi Night",
      artist:"Chill Boy",
      audio_file:"uploads/song6.mp3",
      cover_image:"uploads/cover6.jpg",
      language: random(languages),
      category: random(categories)
    }
  ]);

  console.log("🔥 Songs Added with ALL PRO Categories + Languages ✅");
  process.exit();
}

addSongs();
