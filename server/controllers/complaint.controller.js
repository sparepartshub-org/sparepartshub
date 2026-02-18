/**
 * Complaint Controller — file, respond, manage complaints
 */
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { createComplaintSchema, respondComplaintSchema, updateComplaintStatusSchema } = require('../validators/complaint.validator');

/** POST /api/complaints — customer files a complaint */
exports.createComplaint = async (req, res, next) => {
  try {
    const { error, value } = createComplaintSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    value.customer = req.user._id;
    const complaint = await Complaint.create(value);

    res.status(201).json({ message: 'Complaint filed successfully.', complaint });
  } catch (err) {
    next(err);
  }
};

/** GET /api/complaints/my — customer's complaints */
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ customer: req.user._id })
      .populate('wholesaler', 'name businessName')
      .populate('order', 'orderNumber')
      .sort('-createdAt');
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};

/** GET /api/complaints — admin gets all complaints */
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('customer', 'name email')
      .populate('wholesaler', 'name businessName')
      .populate('order', 'orderNumber')
      .sort('-createdAt');
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};

/** GET /api/complaints/wholesaler/my — complaints against wholesaler */
exports.getWholesalerComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ wholesaler: req.user._id })
      .populate('customer', 'name email')
      .populate('order', 'orderNumber')
      .sort('-createdAt');
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};

/** GET /api/complaints/:id */
exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('wholesaler', 'name businessName')
      .populate('order', 'orderNumber')
      .populate('responses.user', 'name role');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    // Auth check
    const isCustomer = complaint.customer._id.toString() === req.user._id.toString();
    const isWholesaler = complaint.wholesaler && complaint.wholesaler._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isWholesaler && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

/** POST /api/complaints/:id/respond — admin/wholesaler responds */
exports.respondToComplaint = async (req, res, next) => {
  try {
    const { error, value } = respondComplaintSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    complaint.responses.push({ user: req.user._id, message: value.message });
    if (complaint.status === 'open') complaint.status = 'in_progress';
    await complaint.save();

    await complaint.populate('responses.user', 'name role');
    res.json({ message: 'Response added.', complaint });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/complaints/:id/status — admin updates status */
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { error, value } = updateComplaintStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    complaint.status = value.status;
    if (value.status === 'resolved') complaint.resolvedAt = new Date();
    await complaint.save();

    res.json({ message: 'Complaint status updated.', complaint });
  } catch (err) {
    next(err);
  }
};
