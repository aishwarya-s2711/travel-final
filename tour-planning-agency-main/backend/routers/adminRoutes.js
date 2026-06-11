const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../utlis/authMiddleware');
const adminController = require('../controller/adminController');

// All routes are protected and require admin privileges
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Destinations
router.get('/destinations', adminController.getDestinations);
router.post('/destinations', adminController.createDestination);
router.put('/destinations/:id', adminController.updateDestination);
router.delete('/destinations/:id', adminController.deleteDestination);

// Reviews
router.get('/reviews', adminController.getReviews);
router.put('/reviews/:id/approve', adminController.updateReviewStatus);
router.delete('/reviews/:id', adminController.deleteReview);

// Payments
router.get('/payments', adminController.getPayments);

// Blogs
router.get('/blogs', adminController.getBlogs);
router.post('/blogs', adminController.createBlog);
router.put('/blogs/:id', adminController.updateBlog);
router.delete('/blogs/:id', adminController.deleteBlog);

// Notifications
router.get('/notifications', adminController.getNotifications);
router.put('/notifications/read-all', adminController.markAllNotificationsRead);
router.put('/notifications/:id/read', adminController.markNotificationRead);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
