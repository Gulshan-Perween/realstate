// const mongoose = require('mongoose');

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log('✅ MongoDB connected');
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

let isConnected = false; // 👈 important for serverless

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // ⏱️ fast fail instead of hang
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
