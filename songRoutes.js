// Add favorite
router.post("/:id/favorite", async (req, res) => {
  try {
    const { user_id } = req.body;
    const song_id = req.params.id;

    const existing = await Favorite.findOne({ user_id, song_id });
    if (existing) return res.status(400).json({ message: "Already favorited" });

    const favorite = new Favorite({ user_id, song_id });
    await favorite.save();
    res.json({ message: "Song added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user favorites
router.get("/favorites/:user_id", async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.params.user_id }).populate("song_id");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
