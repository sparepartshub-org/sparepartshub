/**
 * Joi validation schemas for complaint routes
 */
const Joi = require('joi');

const createComplaintSchema = Joi.object({
  order: Joi.string().allow('', null),
  wholesaler: Joi.string().allow('', null),
  subject: Joi.string().trim().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  type: Joi.string()
    .valid('product_quality', 'delivery', 'wrong_item', 'refund', 'other')
    .default('other'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
});

const respondComplaintSchema = Joi.object({
  message: Joi.string().min(2).max(2000).required(),
});

const updateComplaintStatusSchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required(),
});

module.exports = { createComplaintSchema, respondComplaintSchema, updateComplaintStatusSchema };
