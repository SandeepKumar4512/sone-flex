exports.addFavorite = async (req, res) => {
    res.json({ message: "Song added to favorites", data: req.body });
};

exports.getFavorites = async (req, res) => {
    res.json([{ id: 1, title: "Demo Song", artist: "Sone Flex" }]);
};
