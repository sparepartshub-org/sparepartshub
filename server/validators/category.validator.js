/**
 * Joi validation schemas for category routes
 */
const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().max(500).allow(''),
  vehicleType: Joi.string().valid('bike', 'car', 'tractor', 'both').default('both'),
});

const updateCategorySchema = createCategorySchema.fork(['name'], (s) => s.optional());

module.exports = { createCategorySchema, updateCategorySchema };
