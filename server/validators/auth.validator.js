/**
 * Joi validation schemas for authentication routes
 */
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('customer', 'wholesaler').default('customer'),
  phone: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).allow(''),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zipCode: Joi.string().allow(''),
    country: Joi.string().default('India'),
  }),
  // Wholesaler fields
  businessName: Joi.when('role', {
    is: 'wholesaler',
    then: Joi.string().trim().min(2).max(100).required(),
    otherwise: Joi.string().allow(''),
  }),
  businessLicense: Joi.string().allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };
