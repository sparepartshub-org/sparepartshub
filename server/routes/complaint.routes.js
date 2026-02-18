const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/complaint.controller');

router.post('/', authenticate, authorize('customer'), ctrl.createComplaint);
router.get('/my', authenticate, authorize('customer'), ctrl.getMyComplaints);
router.get('/wholesaler/my', authenticate, authorize('wholesaler'), ctrl.getWholesalerComplaints);
router.get('/all', authenticate, authorize('admin'), ctrl.getAllComplaints);
router.get('/:id', authenticate, ctrl.getComplaint);
router.post('/:id/respond', authenticate, authorize('admin', 'wholesaler'), ctrl.respondToComplaint);
router.put('/:id/status', authenticate, authorize('admin'), ctrl.updateComplaintStatus);

module.exports = router;
