require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
console.log("MONGO URI 👉", process.env.MONGO_URI);
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
