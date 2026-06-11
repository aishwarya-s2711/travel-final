const express = require('express');
const router = express.Router();
const Notification = require('../model/Notification');
const { protect, onlyAdmin } = require('../utlis/authMiddleware');

// Get user notifications
router.get('/user', protect, async (req, res) => {
  try {
    const notifications = await Notification
      .find({ 'data.userId': req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all notifications (admin)
router.get('/all', protect, onlyAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
