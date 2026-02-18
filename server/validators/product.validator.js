/**
 * Joi validation schemas for product routes
 */
const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  price: Joi.number().positive().required(),
  comparePrice: Joi.number().positive().allow(null),
  category: Joi.string().required(), // ObjectId as string
  brand: Joi.string().trim().min(1).max(100).required(),
  vehicleType: Joi.string().valid('bike', 'car', 'tractor').required(),
  vehicleMake: Joi.string().trim().max(100).allow(''),
  vehicleModel: Joi.string().trim().max(100).allow(''),
  partNumber: Joi.string().trim().max(100).allow(''),
  stock: Joi.number().integer().min(0).required(),
  tags: Joi.array().items(Joi.string().trim()).max(10),
  dealerState: Joi.string().trim().max(100).allow(''),
  dealerCity: Joi.string().trim().max(100).allow(''),
});

const updateProductSchema = createProductSchema.fork(
  ['name', 'description', 'price', 'category', 'brand', 'vehicleType', 'stock'],
  (schema) => schema.optional()
);

module.exports = { createProductSchema, updateProductSchema };
