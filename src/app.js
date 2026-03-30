// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 👈 add this

const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const adminRoutes = require('./routes/admin.routes');
const adminanalyticsRoutes = require('./routes/admin.analytics.routes');

const app = express();

app.use(cors());
app.use(express.json());

// 👇 Connect DB before every request (Vercel serverless safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', adminanalyticsRoutes);

app.get('/health', (req, res) => res.send('OK'));

module.exports = app;