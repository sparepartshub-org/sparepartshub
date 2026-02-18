/**
 * Nodemailer transporter configuration
 */
const nodemailer = require('nodemailer');

const createTransporter = () => {
  // In development without SMTP credentials, use a preview-only transport
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP credentials not set — emails will be logged to console');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

module.exports = createTransporter;
