const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// @route   GET /api/auth/me (alias for profile)
router.get('/me', protect, getProfile);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   DELETE /api/auth/account
router.delete('/account', protect, deleteAccount);

module.exports = router;
