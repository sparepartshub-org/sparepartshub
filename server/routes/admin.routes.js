const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

router.get('/dashboard', authenticate, authorize('admin'), ctrl.getDashboard);
router.get('/users', authenticate, authorize('admin'), ctrl.getUsers);
router.put('/users/:id', authenticate, authorize('admin'), ctrl.updateUser);
router.delete('/users/:id', authenticate, authorize('admin'), ctrl.deleteUser);

module.exports = router;
