exports.uploadSong = async (req, res) => {
    res.json({ message: "Song uploaded", data: req.body });
};

exports.addCategory = async (req, res) => {
    res.json({ message: "Category added", data: req.body });
};

exports.addBanner = async (req, res) => {
    res.json({ message: "Banner added", data: req.body });
};

exports.getUsers = async (req, res) => {
    res.json([{ id: 1, name: "User 1" }]);
};
