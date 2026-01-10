// // const mongoose = require('mongoose');

// // const connectDB = async () => {
// //   await mongoose.connect(process.env.MONGO_URI);
// //   console.log('✅ MongoDB connected');
// // };

// // module.exports = connectDB;

// const mongoose = require("mongoose");

// let isConnected = false; // 👈 important for serverless

// const connectDB = async () => {
//   if (isConnected) {
//     return;
//   }

//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // ⏱️ fast fail instead of hang
//     });

//     isConnected = true;
//     console.log("✅ MongoDB connected:", conn.connection.host);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     throw error;
//   }
// };

// module.exports = connectDB;

// const connectDB = async () => {
//   console.log("🔍 Connection state:", mongoose.connection.readyState);
  
//   if (mongoose.connection.readyState === 1) {
//     console.log("✅ Using existing MongoDB connection");
//     return;
//   }

//   console.log("🔄 Establishing new MongoDB connection...");
  
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//     });

//     console.log("✅ MongoDB connected:", conn.connection.host);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     console.error("Full error:", error);
//     throw error;
//   }
// };

const mongoose = require("mongoose");

const connectDB = async () => {
  // Reuse connection if already established
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Wait if connection is in progress
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // For serverless
      minPoolSize: 1,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};


module.exports = connectDB;



