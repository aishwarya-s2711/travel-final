const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile, verifyEmail, resetPassword } = require('../controller/authController');
const { protect } = require('../utlis/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, require('../controller/authController').changePassword);

module.exports = router;
