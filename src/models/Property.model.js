const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  purpose: { type: String, enum: ['rent', 'sell'] },
  propertyType: String,
  bhk: Number,
  area: Number,
  city: String,
  locality: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  status: { type: String, default: 'available' },

      // ADMIN CONTROLS
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, default: "available" },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
