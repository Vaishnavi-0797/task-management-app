const express = require('express');
const rateLimit = require('express-rate-limit');
const requireAuth = require('../middleware/auth');
const { register, login, me } = require('../controllers/authController');

const router = express.Router();

// Slows down password-guessing: 30 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

module.exports = router;
