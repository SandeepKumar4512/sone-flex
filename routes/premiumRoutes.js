const express = require("express");
const router = express.Router();
const { getPlans, buyPlan } = require("../controllers/premiumController");

router.get("/plans", getPlans);
router.post("/buy", buyPlan);
module.exports = router;
