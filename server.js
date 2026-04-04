require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

// BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FAVORITE ROUTE
const fav = require("./favorite");
app.use("/api/favorite", fav);

// Ensure uploads folder
if (!fs.existsSync("public/uploads")) fs.mkdirSync("public/uploads", { recursive: true });

// STATIC
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || "soneflex_secret_key",
  resave: false,
  saveUninitialized: false
}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// ================= SCHEMA =================
const artistSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  googleId: String,
  profilePic: String
});
const Artist = mongoose.model("Artist", artistSchema);

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audio_file: String,
  cover_image: String,
  artistId: String,
  language: String,
  category: String
});
const Song = mongoose.model("Song", songSchema);

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = Date.now() + ext;
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// ================= GOOGLE LOGIN =================
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let artist = await Artist.findOne({ googleId: profile.id });

    if (!artist) {
      artist = new Artist({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilePic: profile.photos[0].value
      });
      await artist.save();
    }

    done(null, artist);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((artist, done) => done(null, artist.id));
passport.deserializeUser(async (id, done) => {
  const artist = await Artist.findById(id);
  done(null, artist);
});

// ================= ROUTES =================

// REGISTER
app.post("/api/artist/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "❌ All fields required" });
    }

    let profilePic = "default.png";
    if (req.file) profilePic = req.file.filename;

    const existing = await Artist.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "❌ Email already exists" });
    }

    const artist = new Artist({
      name: name.trim(),
      email,
      password,
      profilePic
    });

    await artist.save();

    res.json({ message: "✅ Artist registered", artist });

  } catch (err) {
    res.status(500).json({ message: "❌ Registration failed", error: err.message });
  }
});

// SEARCH ARTIST
app.get("/api/artist/search", async (req, res) => {
  try {
    let q = req.query.q;
    if (!q) return res.json([]);

    q = q.toLowerCase().trim();

    const all = await Artist.find();

    const result = all.filter(a => {
      if (!a.name) return false;
      const name = a.name.toLowerCase();

      return name.includes(q);
    });

    res.json(result.slice(0, 10));

  } catch (err) {
    res.status(500).json({ message: "❌ Error" });
  }
});

// GOOGLE LOGIN
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
passport.authenticate("google", { failureRedirect: "/artist-register.html" }),
(req, res) => {
  res.redirect(`/artist.html?artistId=${req.user.id}`);
});

// UPLOAD SONG
app.post("/api/upload", upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "cover", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artistId, language, category, artistName } = req.body;

    const audio_file = req.files.audio[0].filename;
    const cover_image = req.files.cover[0].filename;

    let artist = await Artist.findById(artistId);

    if (!artist && artistName) {
      artist = await Artist.findOne({ name: artistName });
    }

    if (!artist) {
      artist = new Artist({ name: artistName || "Unknown" });
      await artist.save();
    }

    const song = new Song({
      title,
      artist: artist.name,
      artistId: artist._id,
      audio_file,
      cover_image,
      language,
      category
    });

    await song.save();

    res.json({ message: "✅ Song uploaded", song });

  } catch (err) {
    res.status(500).json({ message: "❌ Upload failed", error: err.message });
  }
});

// 🎵 SONG API (🔥 MAIN FIX)
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find();

    const result = await Promise.all(
      songs.map(async (s) => {
        const artist = await Artist.findById(s.artistId);

        return {
          _id: s._id,
          title: s.title,
          audio_file: s.audio_file,
          cover_image: s.cover_image,
          language: s.language,
          category: s.category,

          artistName: artist ? artist.name : s.artist,
          artistPic: artist && artist.profilePic
            ? "/uploads/" + artist.profilePic
            : "/uploads/default.png"
        };
      })
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "❌ Error loading songs" });
  }
});

// START
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
