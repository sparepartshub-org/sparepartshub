/**
 * Auth Controller — register, login, refresh token, logout, profile
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/auth.validator');

// Generate JWT tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
  return { accessToken, refreshToken };
};

/** POST /api/auth/register */
exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    // Check if email already exists
    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create(value);
    const tokens = generateTokens(user._id, user.role);

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({
      message: 'Registration successful!',
      user,
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/login */
exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Validation error', errors: error.details.map(d => d.message) });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(value.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    if (!user.isActive) return res.status(403).json({ message: 'Account has been deactivated.' });

    // Wholesaler approval check
    if (user.role === 'wholesaler' && !user.isApproved) {
      return res.status(403).json({ message: 'Your wholesaler account is pending approval.' });
    }

    const tokens = generateTokens(user._id, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ message: 'Login successful!', user, ...tokens });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/refresh */
exports.refreshToken = async (req, res, next) => {
  try {
    const { error, value } = refreshTokenSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Refresh token is required.' });

    const decoded = jwt.verify(value.refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== value.refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    const tokens = generateTokens(user._id, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expired. Please login again.' });
    }
    next(err);
  }
};

/** POST /api/auth/logout */
exports.logout = async (req, res, next) => {
  try {
    req.user.refreshToken = '';
    await req.user.save();
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/me */
exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

/** PUT /api/auth/me */
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'address', 'businessName'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};
