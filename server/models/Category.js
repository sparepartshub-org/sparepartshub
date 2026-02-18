/**
 * Category Model — organizes spare parts (e.g., Engine, Brakes, Electrical)
 */
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    vehicleType: { type: String, enum: ['bike', 'car', 'tractor', 'both'], default: 'both' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
