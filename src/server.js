// server.js
require("dotenv").config();
const app = require("./app");

module.exports = app; // connectDB is now handled inside app.js middleware