const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  console.log("AUTH HEADER 👉", req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user & remove password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
