const jwt = require("jsonwebtoken");

const JWT_SECRET = "soneflex_secret";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("🔍 HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // Bearer token split
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token ❌" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("✅ USER:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.log("❌ AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Unauthorized ❌",
      error: err.message
    });
  }
};
