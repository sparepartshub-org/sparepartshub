/**
 * Product Controller — CRUD + search/filter for spare parts
 */
const Product = require('../models/Product');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');

/** Helper: create slug from name */
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

/** GET /api/products — public listing with search & filters */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, search, category, vehicleType,
      brand, minPrice, maxPrice, wholesaler, sort = '-createdAt',
    } = req.query;

    const filter = { isActive: true };
    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (vehicleType) filter.vehicleType = vehicleType;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (wholesaler) filter.wholesaler = wholesaler;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('wholesaler', 'name businessName')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/products/:id */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('wholesaler', 'name businessName email phone');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

/** POST /api/products — wholesaler creates product */
exports.createProduct = async (req, res, next) => {
  try {
    const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    value.wholesaler = req.user._id;
    value.slug = slugify(value.name);

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      value.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    const product = await Product.create(value);
    await product.populate('category', 'name slug');

    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/products/:id — wholesaler/admin updates product */
exports.updateProduct = async (req, res, next) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    // Only owner or admin can update
    if (req.user.role !== 'admin' && product.wholesaler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    if (req.files && req.files.length > 0) {
      value.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    Object.assign(product, value);
    await product.save();
    await product.populate('category', 'name slug');

    res.json({ message: 'Product updated.', product });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/products/:id */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (req.user.role !== 'admin' && product.wholesaler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};

/** GET /api/products/wholesaler/my — wholesaler's own products */
exports.getMyProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find({ wholesaler: req.user._id })
        .populate('category', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments({ wholesaler: req.user._id }),
    ]);

    res.json({ products, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    next(err);
  }
};
