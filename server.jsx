const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* uploads folder access */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* frontend serve */
app.use(express.static(path.join(__dirname, "../frontend")));

/* routes */
const songRoutes = require("./routes/songRoutes");
app.use("/api/songs", songRoutes);

/* database connect */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.log(err);
});

/* home route */
app.get("/", (req, res) => {
  res.send("Sone Flex API Running");
});

/* server start */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
