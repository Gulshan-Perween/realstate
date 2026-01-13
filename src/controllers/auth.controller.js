// const User = require('../models/User.model');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // ================= REGISTER =================



//   exports.register = async (req, res) => {
//   console.log('REGISTER BODY 👉', req.body);

//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email and password are required'
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || 'user'
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error('REGISTER ERROR:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };


// // ================= LOGIN =================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ Validate
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     // 2️⃣ Find user
//     const user = await User.findOne({email});
   
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // 3️⃣ Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // 4️⃣ Generate token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error('LOGIN ERROR:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// exports.logout = (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Logout successful'
//   });
// };


const connectDB = require("../config/db");  // ✅ ADD THIS LINE
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ================= REGISTER =================
exports.register = async (req, res) => {
  console.log('📝 REGISTER BODY 👉', req.body);

  try {
    // ✅ PEHLE DB CONNECT KARO
    console.log("⏳ Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected");

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    console.log("🔍 Checking if user exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    console.log("📝 Creating new user...");
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    console.log("✅ User created successfully:", user._id);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  console.log('🔐 LOGIN REQUEST');

  try {
    // ✅ PEHLE DB CONNECT KARO
    console.log("⏳ Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected");

    const { email, password } = req.body;

    // 1️⃣ Validate
    if (!email || !password) {
      console.log("❌ Email or password missing");
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // 2️⃣ Find user
    console.log("🔍 Finding user:", email);
    const user = await User.findOne({ email });
   
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log("✅ User found:", user._id);

    // 3️⃣ Compare password
    console.log("🔐 Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log("✅ Password correct");

    // 4️⃣ Generate token
    console.log("🎫 Generating JWT token...");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("✅ Login successful");
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
    console.error('Full error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};