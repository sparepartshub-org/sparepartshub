/**
 * Email Notification Service — sends transactional emails via Nodemailer
 */
const createTransporter = require('../config/email');

const transporter = createTransporter();

/**
 * Send an email (silently logs if SMTP not configured)
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`📧 [Email Preview] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"SparePartsHub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
  }
};

/** Order confirmation email */
const sendOrderConfirmation = async (order, customerEmail) => {
  const itemsList = order.items
    .map((i) => `<li>${i.name} × ${i.quantity} — ₹${i.price * i.quantity}</li>`)
    .join('');

  await sendEmail({
    to: customerEmail,
    subject: `Order Confirmed — #${order.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e40af">🔧 SparePartsHub — Order Confirmation</h2>
        <p>Hi! Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
        <h3>Items:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Total: ₹${order.totalAmount}</strong></p>
        <p>Payment: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
        <hr/>
        <p style="color:#6b7280;font-size:12px">Thank you for shopping with SparePartsHub!</p>
      </div>
    `,
  });
};

/** Order status update email */
const sendOrderStatusUpdate = async (order, customerEmail) => {
  const statusColors = {
    confirmed: '#16a34a',
    shipped: '#2563eb',
    delivered: '#059669',
    cancelled: '#dc2626',
  };
  const color = statusColors[order.status] || '#374151';

  await sendEmail({
    to: customerEmail,
    subject: `Order #${order.orderNumber} — ${order.status.toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e40af">🔧 SparePartsHub — Order Update</h2>
        <p>Your order <strong>#${order.orderNumber}</strong> status has been updated:</p>
        <p style="font-size:24px;color:${color};font-weight:bold">${order.status.toUpperCase()}</p>
        ${order.trackingNumber ? `<p>Tracking: <strong>${order.trackingNumber}</strong></p>` : ''}
        <hr/>
        <p style="color:#6b7280;font-size:12px">Thank you for shopping with SparePartsHub!</p>
      </div>
    `,
  });
};

/** Complaint response notification */
const sendComplaintResponse = async (complaint, customerEmail, responderName) => {
  const latestResponse = complaint.responses[complaint.responses.length - 1];
  await sendEmail({
    to: customerEmail,
    subject: `Complaint Update — ${complaint.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1e40af">🔧 SparePartsHub — Complaint Update</h2>
        <p>Your complaint "<strong>${complaint.subject}</strong>" received a response from <strong>${responderName}</strong>:</p>
        <blockquote style="border-left:3px solid #1e40af;padding-left:12px;color:#374151">
          ${latestResponse.message}
        </blockquote>
        <p>Status: <strong>${complaint.status}</strong></p>
        <hr/>
        <p style="color:#6b7280;font-size:12px">Thank you for your patience!</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendComplaintResponse,
};
