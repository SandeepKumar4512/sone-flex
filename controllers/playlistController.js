exports.createPlaylist = async (req, res) => {
    res.json({ message: "Playlist created", data: req.body });
};

exports.addSong = async (req, res) => {
    res.json({ message: "Song added to playlist", data: req.body });
};

exports.getUserPlaylists = async (req, res) => {
    res.json([{ id: 1, name: "Love Songs" }]);
};
