const express = require('express');
const router  = express.Router();
const { protect, adminOnly, onlyAdmin } = require('../utlis/authMiddleware');
const User = require('../model/User');
const Booking = require('../model/Booking');
const authController = require('../controller/authController');

// GET /api/users/wishlist — user: get wishlist packages
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/wishlist — user: add/remove package from wishlist
router.post('/wishlist', protect, async (req, res) => {
  try {
    const { packageId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const index = user.wishlist.indexOf(packageId);
    if (index === -1) {
      user.wishlist.push(packageId);
    } else {
      user.wishlist.splice(index, 1);
    }
    
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile — user: update profile details
router.put('/profile', protect, authController.updateProfile);

// GET /api/users — admin: list all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id — admin: get user by id
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id/status — admin: toggle active status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id/bookings — admin only: view a specific customer's bookings
router.get('/:id/bookings', protect, onlyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id })
      .populate('package', 'title destination price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
