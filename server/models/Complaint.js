/**
 * Complaint Model — customer complaints to admin/wholesaler
 */
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    wholesaler: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['product_quality', 'delivery', 'wrong_item', 'refund', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    responses: [responseSchema],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.index({ customer: 1 });
complaintSchema.index({ wholesaler: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
