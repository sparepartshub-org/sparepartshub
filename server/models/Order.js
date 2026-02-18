/**
 * Order Model — tracks customer orders across multiple wholesalers
 */
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  wholesaler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    itemsTotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [statusHistorySchema],
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    estimatedDelivery: { type: Date },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
