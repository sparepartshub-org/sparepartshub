/**
 * User Model — supports Admin, Wholesaler, and Customer roles
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'wholesaler', 'customer'], default: 'customer' },
    phone: { type: String, trim: true },
    whatsappNumber: { type: String, trim: true }, // WhatsApp number for dealers
    address: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
      country: { type: String, default: 'India' },
    },
    // Wholesaler-specific fields
    businessName: { type: String, trim: true },
    businessLicense: { type: String, trim: true },
    isApproved: { type: Boolean, default: false }, // Admin must approve wholesalers
    // Account status
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
