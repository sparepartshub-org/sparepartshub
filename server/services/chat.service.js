/**
 * AI Chatbot Service — rule-based with optional OpenAI integration
 * Handles product queries, order status, availability, and general help
 */
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Process a user message and return a bot response
 */
const processMessage = async (message, userId) => {
  const msg = message.toLowerCase().trim();

  // --- Order status queries ---
  const orderMatch = msg.match(/order\s*#?\s*([A-Z0-9-]+)/i) || msg.match(/track\s+([A-Z0-9-]+)/i);
  if (orderMatch || msg.includes('order status') || msg.includes('track my order') || msg.includes('where is my order')) {
    if (orderMatch) {
      const orderNum = orderMatch[1].toUpperCase();
      const order = await Order.findOne({ orderNumber: orderNum, customer: userId });
      if (order) {
        const statusEmoji = { placed: '📦', confirmed: '✅', shipped: '🚚', delivered: '🎉', cancelled: '❌' };
        return `${statusEmoji[order.status] || '📋'} **Order #${order.orderNumber}**\n` +
          `Status: **${order.status.toUpperCase()}**\n` +
          `Total: ₹${order.totalAmount}\n` +
          `Items: ${order.items.length}\n` +
          (order.trackingNumber ? `Tracking: ${order.trackingNumber}\n` : '') +
          (order.estimatedDelivery ? `ETA: ${new Date(order.estimatedDelivery).toLocaleDateString()}` : '');
      }
      return `I couldn't find order #${orderNum}. Please check the order number and try again.`;
    }
    // General order query — list recent orders
    const recentOrders = await Order.find({ customer: userId }).sort({ createdAt: -1 }).limit(3);
    if (recentOrders.length > 0) {
      const list = recentOrders.map(o => `• #${o.orderNumber} — ${o.status.toUpperCase()} — ₹${o.totalAmount}`).join('\n');
      return `Here are your recent orders:\n${list}\n\nAsk me about a specific order using its number!`;
    }
    return "You don't have any orders yet. Browse our products and place your first order!";
  }

  // --- Product availability / search ---
  if (msg.includes('available') || msg.includes('in stock') || msg.includes('do you have') || msg.includes('find') || msg.includes('search')) {
    // Extract search terms (remove common words)
    const stopWords = ['available', 'in', 'stock', 'do', 'you', 'have', 'find', 'search', 'for', 'is', 'the', 'a', 'any', 'me'];
    const terms = msg.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2).join(' ');
    if (terms) {
      const products = await Product.find({
        $text: { $search: terms },
        isActive: true,
        stock: { $gt: 0 },
      }).limit(5).select('name price stock brand vehicleType');

      if (products.length > 0) {
        const list = products.map(p => `• **${p.name}** (${p.brand}) — ₹${p.price} — ${p.stock} in stock`).join('\n');
        return `Found ${products.length} matching product(s):\n${list}\n\nWould you like more details on any of these?`;
      }
      return `Sorry, I couldn't find products matching "${terms}". Try different keywords or browse our categories!`;
    }
    return "What product are you looking for? Tell me the part name, brand, or vehicle type!";
  }

  // --- Pricing ---
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    const terms = msg.split(/\s+/).filter(w => !['price', 'cost', 'how', 'much', 'of', 'the', 'is', 'a', 'for', 'what'].includes(w) && w.length > 2).join(' ');
    if (terms) {
      const product = await Product.findOne({
        $text: { $search: terms },
        isActive: true,
      }).select('name price comparePrice brand stock');
      if (product) {
        let response = `**${product.name}** (${product.brand})\nPrice: ₹${product.price}`;
        if (product.comparePrice) response += ` (MRP: ₹${product.comparePrice})`;
        response += `\nAvailability: ${product.stock > 0 ? `${product.stock} in stock ✅` : 'Out of stock ❌'}`;
        return response;
      }
    }
    return "Which product's price would you like to know? Tell me the name or part number!";
  }

  // --- Categories / help ---
  if (msg.includes('categories') || msg.includes('what do you sell') || msg.includes('what parts')) {
    return "🔧 We sell spare parts for **bikes** and **cars**!\n\nCategories include:\n• Engine Parts\n• Brake Systems\n• Electrical Components\n• Body Parts\n• Suspension\n• Filters & Fluids\n• Transmission\n\nUse the search bar or browse by category to find what you need!";
  }

  // --- Greetings ---
  if (msg.match(/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy)/)) {
    return "Hello! 👋 Welcome to SparePartsHub! I can help you with:\n\n• 🔍 **Finding products** — \"Do you have brake pads for Honda?\"\n• 📦 **Order tracking** — \"Track order #SPH-12345\"\n• 💰 **Pricing** — \"How much is a clutch plate?\"\n• 📂 **Categories** — \"What parts do you sell?\"\n\nHow can I help you today?";
  }

  // --- Help ---
  if (msg.includes('help') || msg === '?') {
    return "Here's what I can do:\n\n• 🔍 **Search products** — Ask about availability or search for parts\n• 📦 **Track orders** — Give me your order number\n• 💰 **Check prices** — Ask about any product's price\n• 📂 **Browse categories** — See what we offer\n• 📞 **Support** — File a complaint through your dashboard\n\nJust type your question naturally!";
  }

  // --- Delivery ---
  if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('how long')) {
    return "🚚 **Delivery Information:**\n\n• Standard delivery: 3-7 business days\n• Shipping is calculated at checkout based on your location\n• You'll receive tracking updates via email\n• Cash on Delivery (COD) available!\n\nWant to track a specific order? Give me the order number!";
  }

  // --- Returns ---
  if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
    return "🔄 **Returns & Refunds:**\n\n• Returns accepted within 7 days of delivery\n• Product must be unused and in original packaging\n• File a complaint through your dashboard for refund requests\n• Refunds are processed within 5-7 business days\n\nNeed to file a complaint? Go to Dashboard → Complaints → New Complaint.";
  }

  // --- Default / fallback ---
  return "I'm not sure I understand. I can help you with:\n\n• Finding products and checking availability\n• Tracking your orders\n• Price information\n• General questions about our services\n\nTry asking something like \"Do you have brake pads?\" or \"Track order #SPH-12345\"!";
};

module.exports = { processMessage };
