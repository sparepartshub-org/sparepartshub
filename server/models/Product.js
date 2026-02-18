/**
 * Product Model — spare parts listed by wholesalers
 */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 }, // original/MRP price for showing discounts
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    wholesaler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true, trim: true },
    vehicleType: { type: String, enum: ['bike', 'car', 'tractor'], required: true },
    vehicleMake: { type: String, trim: true }, // e.g., Honda, Toyota, Mahindra
    vehicleModel: { type: String, trim: true }, // e.g., Civic, CBR, Arjun
    partNumber: { type: String, trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    // Dealer location for state/city filtering
    dealerState: { type: String, trim: true },
    dealerCity: { type: String, trim: true },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ wholesaler: 1 });
productSchema.index({ category: 1 });
productSchema.index({ dealerState: 1 });
productSchema.index({ dealerCity: 1 });

module.exports = mongoose.model('Product', productSchema);
