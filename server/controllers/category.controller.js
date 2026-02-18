/**
 * Category Controller — CRUD for product categories
 */
const Category = require('../models/Category');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** GET /api/categories */
exports.getCategories = async (req, res, next) => {
  try {
    const { vehicleType } = req.query;
    const filter = { isActive: true };
    if (vehicleType) filter.vehicleType = { $in: [vehicleType, 'both'] };

    const categories = await Category.find(filter).sort('name');
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

/** GET /api/categories/:id */
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

/** POST /api/categories — admin only */
exports.createCategory = async (req, res, next) => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    value.slug = slugify(value.name);
    const category = await Category.create(value);
    res.status(201).json({ message: 'Category created.', category });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/categories/:id — admin only */
exports.updateCategory = async (req, res, next) => {
  try {
    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    if (value.name) value.slug = slugify(value.name);
    const category = await Category.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category updated.', category });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/categories/:id — admin only */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};
