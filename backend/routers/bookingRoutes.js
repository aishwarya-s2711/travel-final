const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, processPayment, updateTripStatus } = require('../controller/packageController');
const { protect, onlyAdmin } = require('../utlis/authMiddleware');

router.post('/', protect, createBooking);
router.post('/create', protect, createBooking); // Support both /bookings and /bookings/create
router.get('/my', protect, getMyBookings);
router.get('/user', protect, getMyBookings);
router.get('/all', protect, onlyAdmin, getAllBookings);
router.put('/:id/status', protect, onlyAdmin, updateBookingStatus);
router.put('/:id/trip-status', protect, onlyAdmin, updateTripStatus);
router.post('/payment', protect, processPayment);

module.exports = router;
