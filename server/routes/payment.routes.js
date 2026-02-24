const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/payment.controller');

router.get('/key', authenticate, ctrl.getRazorpayKey);
router.post('/create-order', authenticate, ctrl.createRazorpayOrder);
router.post('/verify', authenticate, ctrl.verifyPayment);

module.exports = router;
