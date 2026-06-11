const express = require('express');
const router  = require('express').Router();
const { protect, onlyAdmin } = require('../utlis/authMiddleware');
const { Review } = require('../model/Blog');
const Notification = require('../model/Notification');
const Booking = require('../model/Booking');

// POST /api/reviews - Create review (user)
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, packageId, rating, comment } = req.body;
    
    if (!rating || !comment || !packageId) {
      return res.status(400).json({ message: 'Rating, comment, and package are required' });
    }

    // Check if booking exists and is completed
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.status !== 'Completed') {
        return res.status(400).json({ message: 'Can only review completed bookings' });
      }
      if (booking.reviewSubmitted) {
        return res.status(400).json({ message: 'Review already submitted for this booking' });
      }
    }

    const review = await Review.create({
      user: req.user._id,
      booking: bookingId || null,
      package: packageId,
      rating: Number(rating),
      comment
    });

    // Mark booking as reviewed
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { reviewSubmitted: true });
    }

    await review.populate('user', 'name email');
    await review.populate('package', 'title');

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/user — user: get reviews submitted by logged-in user
router.get('/user', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('package', 'title')
      .populate('booking', 'bookingId')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/package/:id - Get reviews for a package
router.get('/package/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/all - Get all reviews (admin)
router.get('/all', protect, onlyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('package', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/reviews/:id/reply - Admin reply to review
router.put('/:id/reply', protect, onlyAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply, repliedAt: new Date() },
      { new: true }
    ).populate('user package');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Notify user
    await Notification.create({
      type: 'System',
      title: 'Admin Replied to Your Review',
      message: `TravelGo has replied to your review for "${review.package?.title || 'a package'}"`,
      data: { reviewId: review._id, userId: review.user._id }
    });

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
