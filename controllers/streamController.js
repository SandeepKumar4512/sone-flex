const jwt = require("jsonwebtoken");

exports.streamSong = async (req, res) => {
    const songId = req.params.song_id;
    const token = jwt.sign({ songId }, process.env.JWT_SECRET, { expiresIn: '5m' });
    res.json({
        audio_url: `https://cdn.example.com/songs/${songId}.mp3?token=${token}`,
        token
    });
};
