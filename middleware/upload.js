const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (file.fieldname === "audio") {
      cb(null, "uploads/songs/");
    } 
    else if (file.fieldname === "cover") {
      cb(null, "uploads/covers/");
    }

  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }

});

const upload = multer({ storage });

module.exports = upload;
