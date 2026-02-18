const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/category.controller');

router.get('/', ctrl.getCategories);
router.get('/:id', ctrl.getCategory);
router.post('/', authenticate, authorize('admin'), ctrl.createCategory);
router.put('/:id', authenticate, authorize('admin'), ctrl.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteCategory);

module.exports = router;
