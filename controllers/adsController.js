exports.getAds = async (req, res) => {
    res.json([
        { type: "banner", content: "Banner Ad" },
        { type: "interstitial", content: "Interstitial Ad" },
        { type: "reward", content: "Reward Ad" }
    ]);
};
