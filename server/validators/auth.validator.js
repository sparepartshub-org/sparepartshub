/**
 * Joi validation schemas for authentication routes
 */
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('customer', 'wholesaler').default('customer'),
  phone: Joi.string().pattern(/^\+91[0-9]{10}$/).allow('', null).messages({
    'string.pattern.base': 'Phone must be in +91XXXXXXXXXX format (Indian mobile number)',
  }),
  whatsappNumber: Joi.string().pattern(/^\+91[0-9]{10}$/).allow('', null).messages({
    'string.pattern.base': 'WhatsApp number must be in +91XXXXXXXXXX format',
  }),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    pinCode: Joi.string().pattern(/^[0-9]{6}$/).allow('', null).messages({
      'string.pattern.base': 'PIN Code must be exactly 6 digits',
    }),
    country: Joi.string().default('India'),
  }),
  // Wholesaler fields
  businessName: Joi.when('role', {
    is: 'wholesaler',
    then: Joi.string().trim().min(2).max(100).required(),
    otherwise: Joi.string().allow('', null),
  }),
  businessLicense: Joi.string().allow('', null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };
