exports.getPlans = async (req, res) => {
    res.json([{ plan: "monthly", price: 100 }, { plan: "yearly", price: 1000 }]);
};

exports.buyPlan = async (req, res) => {
    res.json({ message: "Plan purchased", data: req.body });
};
