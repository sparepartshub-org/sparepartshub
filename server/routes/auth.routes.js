const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/google', ctrl.googleLogin);
router.post('/refresh', ctrl.refreshToken);
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, ctrl.getProfile);
router.put('/me', authenticate, ctrl.updateProfile);

module.exports = router;
