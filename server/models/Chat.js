/**
 * Chat Model — stores AI chatbot conversation history per user
 */
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, sessionId: 1 });

module.exports = mongoose.model('Chat', chatSchema);
