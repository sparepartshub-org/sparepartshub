/**
 * SparePartsHub — Express Server Entry Point
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security & parsing middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any Vercel preview URL for this project
    if (origin.includes('vercel.app') || origin.includes('localhost') || allowed.includes(origin)) {
      return callback(null, true);
    }
    callback(null, true); // Allow all origins for now (can restrict later)
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Static files (uploads)
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/complaints', require('./routes/complaint.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// Root route
app.get('/', (req, res) => res.json({
  name: '🔧 SparePartsHub API',
  version: '1.0.0',
  description: 'Multi-vendor marketplace for bike, car & tractor spare parts 🇮🇳',
  status: '✅ Running',
  endpoints: {
    auth: '/api/auth',
    products: '/api/products',
    orders: '/api/orders',
    categories: '/api/categories',
    complaints: '/api/complaints',
    admin: '/api/admin',
    chat: '/api/chat',
    health: '/api/health'
  }
}));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SparePartsHub server running on port ${PORT}`);
});

module.exports = app;
