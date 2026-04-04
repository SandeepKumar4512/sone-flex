const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now()+"_"+file.originalname)
});
const upload = multer({ storage });

router.post("/update", upload.single("avatar"), async (req,res)=>{
  try{
    const { email, name, city } = req.body;

    const user = await User.findOne({ email });

    if(!user) return res.json({message:"User not found ❌"});

    if(name) user.name = name;
    if(city) user.city = city;
    if(req.file) user.avatar = req.file.path;

    await user.save();

    res.json({message:"Profile Updated ✅", user});
  }catch(err){
    res.status(500).json({message:"Error", error: err.message});
  }
});

module.exports = router;
