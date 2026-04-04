const express = require("express");
const router = express.Router();
const { getAds } = require("../controllers/adsController");

router.get("/", getAds);
module.exports = router;
