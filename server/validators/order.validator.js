/**
 * Joi validation schemas for order routes
 */
const Joi = require('joi');

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pinCode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
      'string.pattern.base': 'PIN Code must be exactly 6 digits',
    }),
    country: Joi.string().default('India'),
  }).required(),
  paymentMethod: Joi.string().valid('cod').default('cod'), // COD only
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled').required(),
  note: Joi.string().max(500).allow(''),
  trackingNumber: Joi.string().max(100).allow(''),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
