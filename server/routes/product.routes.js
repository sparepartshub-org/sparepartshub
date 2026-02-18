const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/product.controller');

// Public
router.get('/', ctrl.getProducts);
router.get('/detail/:id', ctrl.getProduct);

// Wholesaler
router.get('/wholesaler/my', authenticate, authorize('wholesaler'), ctrl.getMyProducts);
router.post('/', authenticate, authorize('wholesaler', 'admin'), upload.array('images', 5), ctrl.createProduct);
router.put('/:id', authenticate, authorize('wholesaler', 'admin'), upload.array('images', 5), ctrl.updateProduct);
router.delete('/:id', authenticate, authorize('wholesaler', 'admin'), ctrl.deleteProduct);

module.exports = router;
