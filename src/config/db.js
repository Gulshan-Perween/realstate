// // require("dotenv").config();

// // const mongoose = require('mongoose');

// // const connectDB = async () => {
// //   await mongoose.connect(process.env.MONGO_URI);
// //   console.log("MONGO URI frm db.js 👉", process.env.MONGO_URI);
// //   console.log('✅ MongoDB connected');
// // };

// // module.exports = connectDB;
// // require("dotenv").config();
// // const mongoose = require("mongoose");

// // mongoose.set("bufferCommands", false);

// // let cached = global.mongoose;
// // if (!cached) {
// //   cached = global.mongoose = { conn: null, promise: null };
// // }

// // const connectDB = async () => {
// //   if (!process.env.MONGO_URI) {
// //     throw new Error("❌ MONGODB_URI is missing");
// //   }

// //   if (cached.conn) {
// //     return cached.conn;
// //   }

// //   if (!cached.promise) {
// //     cached.promise = mongoose.connect(process.env.MONGO_URI, {
// //       serverSelectionTimeoutMS: 5000,
// //     });
// //   }

// //   cached.conn = await cached.promise;
// //   console.log("✅ MongoDB connected");
// //   return cached.conn;
// // };

// // module.exports = connectDB;


// // require("dotenv").config();
// // const mongoose = require("mongoose");

// // mongoose.set("bufferCommands", false);

// // let cached = global.mongoose;
// // if (!cached) {
// //   cached = global.mongoose = { conn: null, promise: null };
// // }

// // const connectDB = async () => {
// //   if (!process.env.MONGO_URI) {
// //     throw new Error("❌ MONGODB_URI is missing");
// //   }

// //   if (cached.conn) {
// //     return cached.conn;
// //   }

// //   if (!cached.promise) {
// //     cached.promise = mongoose.connect(process.env.MONGO_URI, {
// //       serverSelectionTimeoutMS: 5000,
// //     });
// //   }

// //   cached.conn = await cached.promise;
// //   console.log("✅ MongoDB connected");
// //   return cached.conn;
// // };

// // module.exports = connectDB;

// require("dotenv").config();
// const mongoose = require("mongoose");

// mongoose.set("bufferCommands", false);

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// const connectDB = async () => {
//   // Check both variable names
//   const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  
//   if (!MONGO_URI) {
//     throw new Error("❌ MONGO_URI or MONGODB_URI is missing in environment variables");
//   }

//   if (cached.conn) {
//     console.log("✅ Using cached MongoDB connection");
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       serverSelectionTimeoutMS: 30000, // 30 seconds for Vercel
//       socketTimeoutMS: 45000,
//       maxPoolSize: 10,
//     };

//     cached.promise = mongoose.connect(MONGO_URI, opts)
//       .then((mongoose) => {
//         console.log("✅ MongoDB connected");
//         return mongoose;
//       })
//       .catch((err) => {
//         cached.promise = null; // Reset on error
//         console.error("❌ MongoDB connection error:", err);
//         throw err;
//       });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

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
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  console.log("🔍 Checking MONGO_URI...");
  
  if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  // Hide password in logs
  const sanitized = MONGO_URI.replace(/:([^@]+)@/, ':****@');
  console.log("📍 MongoDB URI:", sanitized);

  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    console.log("🔌 Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully!");
        console.log("📊 Connection state:", mongoose.connection.readyState);
        return mongoose;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ Connection ready, state:", cached.conn.connection.readyState);
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error establishing connection:", e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;