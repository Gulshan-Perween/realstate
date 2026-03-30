// server.js
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// ✅ Wrap app to ensure DB connects before every request
module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
