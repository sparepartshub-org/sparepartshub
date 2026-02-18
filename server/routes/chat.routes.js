const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/chat.controller');

router.post('/', authenticate, ctrl.sendMessage);
router.get('/history', authenticate, ctrl.getChatHistory);

module.exports = router;
