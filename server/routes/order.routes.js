const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/order.controller');

router.post('/', authenticate, authorize('customer'), ctrl.createOrder);
router.get('/my', authenticate, authorize('customer'), ctrl.getMyOrders);
router.get('/wholesaler/my', authenticate, authorize('wholesaler'), ctrl.getWholesalerOrders);
router.get('/all', authenticate, authorize('admin'), ctrl.getAllOrders);
router.get('/:id', authenticate, ctrl.getOrder);
router.get('/:id/tracking', authenticate, ctrl.getOrderTracking);
router.put('/:id/status', authenticate, authorize('admin', 'wholesaler'), ctrl.updateOrderStatus);

module.exports = router;
