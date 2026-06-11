const User = require('../model/User');
const Booking = require('../model/Booking');
const Package = require('../model/Package');
const Destination = require('../model/Destination');
const { Blog, Review } = require('../model/Blog');
const Payment = require('../model/Payment');
const Notification = require('../model/Notification');
const Settings = require('../model/Settings');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPackages = await Package.countDocuments();
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: { $in: ['Approved', 'Completed'] } });
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Recent bookings
    const recentBookings = await Booking.find().populate('user', 'name email avatar').populate('package', 'title').sort({ createdAt: -1 }).limit(10);

    // Recent notifications
    const recentNotifications = await Notification.find().sort({ createdAt: -1 }).limit(5);

    // Example chart data: dummy mapping for now
    const revenueData = [12000, 19000, 15000, 22000, 18000, 25000];
    const bookingStatusData = [
      { name: 'Pending', value: await Booking.countDocuments({ status: 'Pending' }) },
      { name: 'Approved', value: await Booking.countDocuments({ status: 'Approved' }) },
      { name: 'Denied', value: await Booking.countDocuments({ status: 'Denied' }) },
      { name: 'Cancelled', value: await Booking.countDocuments({ status: 'Cancelled' }) },
    ];

    res.json({
      totalUsers,
      totalBookings,
      totalPackages,
      totalRevenue,
      recentBookings,
      recentNotifications,
      revenueData,
      bookingStatusData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================== DESTINATIONS ======================
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createDestination = async (req, res) => {
  try {
    const dest = await Destination.create(req.body);
    res.status(201).json(dest);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateDestination = async (req, res) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dest);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteDestination = async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Destination deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ====================== REVIEWS ======================
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name avatar').populate('package', 'title').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ====================== PAYMENTS ======================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        select: 'bookingId status package totalAmount',
        populate: { path: 'package', select: 'title' }
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ====================== BLOGS ======================
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    res.status(201).json(blog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ====================== NOTIFICATIONS ======================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notification);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ====================== SETTINGS ======================
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
