// // require('dotenv').config();
// // const app = require('./app');
// // const connectDB = require('./config/db');

// // connectDB();

// // app.listen(process.env.PORT, () => {
// //   console.log(`🚀 Server running on port ${process.env.PORT}`);
// // });

// require('dotenv').config();
// const app = require('./app');
// const connectDB = require('./config/db');

// connectDB();

// // ✅ ONLY listen locally
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// }

// // ✅ Export for Vercel
// module.exports = app;

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

// ✅ Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// ✅ Required for Vercel
module.exports = app;
