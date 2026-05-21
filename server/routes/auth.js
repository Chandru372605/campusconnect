const router = require('express').Router();
const c = require('../controllers/authController');

router.post('/register', c.register);
router.get('/verify/:token', c.verifyEmail);
router.post('/login', c.login);
router.post('/google', c.googleLogin);

module.exports = router;