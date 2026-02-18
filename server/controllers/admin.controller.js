/**
 * Admin Controller — user management, analytics dashboard
 */
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Complaint = require('../models/Complaint');

/** GET /api/admin/dashboard — analytics overview */
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalWholesalers,
      totalProducts,
      totalOrders,
      totalComplaints,
      openComplaints,
      recentOrders,
      salesAgg,
      topProducts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'wholesaler' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'open' }),
      Order.find().sort('-createdAt').limit(5).populate('customer', 'name'),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' }, avgOrder: { $avg: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const sales = salesAgg[0] || { totalSales: 0, avgOrder: 0 };

    res.json({
      stats: {
        totalUsers,
        totalCustomers,
        totalWholesalers,
        totalProducts,
        totalOrders,
        totalComplaints,
        openComplaints,
        totalSales: Math.round(sales.totalSales),
        avgOrderValue: Math.round(sales.avgOrder),
      },
      ordersByStatus,
      topProducts,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/users — list all users with filters */
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ users, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/users/:id — update user (approve, deactivate, change role) */
exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['isActive', 'isApproved', 'role'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User updated.', user });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/users/:id — deactivate user */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deactivated.', user });
  } catch (err) {
    next(err);
  }
};
