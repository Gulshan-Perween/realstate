
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const adminRoutes = require('./routes/admin.routes');
const adminanalyticsRoutes = require('./routes/admin.analytics.routes');

console.log("MONGO URI 👉", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', adminanalyticsRoutes);

app.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = app;