/**
 * Chat Controller — AI chatbot endpoint
 */
const Chat = require('../models/Chat');
const { processMessage } = require('../services/chat.service');

/** POST /api/chat — send message to chatbot */
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }

    const sid = sessionId || `session-${req.user._id}-${Date.now()}`;

    // Get or create chat session
    let chat = await Chat.findOne({ user: req.user._id, sessionId: sid });
    if (!chat) {
      chat = new Chat({ user: req.user._id, sessionId: sid, messages: [] });
    }

    // Save user message
    chat.messages.push({ role: 'user', content: message.trim() });

    // Get bot response
    const response = await processMessage(message.trim(), req.user._id);

    // Save bot response
    chat.messages.push({ role: 'assistant', content: response });
    await chat.save();

    res.json({ response, sessionId: sid });
  } catch (err) {
    next(err);
  }
};

/** GET /api/chat/history — get chat history */
exports.getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const filter = { user: req.user._id };
    if (sessionId) filter.sessionId = sessionId;

    const chats = await Chat.find(filter).sort('-updatedAt').limit(10);
    res.json({ chats });
  } catch (err) {
    next(err);
  }
};
