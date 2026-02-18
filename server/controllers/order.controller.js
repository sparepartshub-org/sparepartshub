/**
 * Order Controller — create, track, update status
 */
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/order.validator');

/** Generate unique order number */
const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SPH-${date}-${rand}`;
};

/** POST /api/orders — customer places order */
exports.createOrder = async (req, res, next) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    // Fetch products and validate stock
    const orderItems = [];
    let itemsTotal = 0;

    for (const item of value.items) {
      const product = await Product.findById(item.product).populate('wholesaler', 'name');
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found.` });
      if (!product.isActive) return res.status(400).json({ message: `${product.name} is no longer available.` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        wholesaler: product.wholesaler._id,
        image: product.images[0] || '',
      });
      itemsTotal += product.price * item.quantity;

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCost = itemsTotal > 2000 ? 0 : 99; // Free shipping over ₹2000
    const tax = Math.round(itemsTotal * 0.18); // 18% GST
    const totalAmount = itemsTotal + shippingCost + tax;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user._id,
      items: orderItems,
      shippingAddress: value.shippingAddress,
      paymentMethod: 'cod', // Always COD
      itemsTotal,
      shippingCost,
      tax,
      totalAmount,
      status: 'placed',
      statusHistory: [{ status: 'placed', note: 'Order placed by customer' }],
      tracking: [{ status: 'placed', description: 'Order has been placed successfully', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days (India delivery)
    });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    next(err);
  }
};

/** GET /api/orders/my — customer's orders */
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { customer: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    next(err);
  }
};

/** GET /api/orders/:id — order details */
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.wholesaler', 'name businessName whatsappNumber phone');

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Authorization check
    const isOwner = order.customer._id.toString() === req.user._id.toString();
    const isWholesaler = order.items.some(i => i.wholesaler._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isWholesaler && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

/** GET /api/orders/:id/tracking — get tracking info for an order */
exports.getOrderTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('orderNumber status tracking estimatedDelivery statusHistory trackingNumber')
      .populate('items.wholesaler', 'name businessName');

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      tracking: order.tracking,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
    });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/orders/:id/status — admin/wholesaler updates status */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    // Tracking step descriptions
    const trackingDescriptions = {
      confirmed: 'Order has been confirmed by the dealer',
      packed: 'Order has been packed and is ready for shipping',
      shipped: 'Order has been shipped and is on the way',
      out_for_delivery: 'Order is out for delivery to your address',
      delivered: 'Order has been delivered successfully',
      cancelled: 'Order has been cancelled',
    };

    order.status = value.status;
    order.statusHistory.push({ status: value.status, note: value.note || '' });
    order.tracking.push({
      status: value.status,
      description: trackingDescriptions[value.status] || value.note || '',
      timestamp: new Date(),
    });

    if (value.trackingNumber) order.trackingNumber = value.trackingNumber;
    if (value.status === 'delivered') {
      order.deliveredAt = new Date();
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();

    res.json({ message: 'Order status updated.', order });
  } catch (err) {
    next(err);
  }
};

/** GET /api/orders/wholesaler/my — orders containing wholesaler's products */
exports.getWholesalerOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { 'items.wholesaler': req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    next(err);
  }
};

/** GET /api/orders — admin gets all orders */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    next(err);
  }
};
