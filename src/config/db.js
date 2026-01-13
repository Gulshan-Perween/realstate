// require("dotenv").config();

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("MONGO URI frm db.js 👉", process.env.MONGO_URI);
//   console.log('✅ MongoDB connected');
// };

// module.exports = connectDB;
// require("dotenv").config();
// const mongoose = require("mongoose");

// mongoose.set("bufferCommands", false);

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDB = async () => {
//   if (!process.env.MONGO_URI) {
//     throw new Error("❌ MONGODB_URI is missing");
//   }

//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,
//     });
//   }

//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB connected");
//   return cached.conn;
// };

// module.exports = connectDB;


require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGODB_URI is missing");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected");
  return cached.conn;
};

module.exports = connectDB;
