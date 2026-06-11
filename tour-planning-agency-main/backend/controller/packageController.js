const Package = require('../model/Package');
const Booking = require('../model/Booking');
const Notification = require('../model/Notification');
const Payment = require('../model/Payment');
const mongoose = require('mongoose');
const { bufferToBase64 } = require('../utlis/upload');

// ══════════════════════════════════════════════════════════════════════════════
//  PACKAGES — CRUD + Search + Filter + Stats
// ══════════════════════════════════════════════════════════════════════════════

// ── Get packages (public) — with filters, search, sort, pagination ───────────
exports.getPackages = async (req, res) => {
  try {
    const {
      type, category, destination, country, status,
      minPrice, maxPrice, minDuration, maxDuration,
      featured, bestseller, search, sort,
      page = 1, limit = 9
    } = req.query;

    const filter = {};

    // By default, only show active packages (public view)
    // Admin can pass status=all to see everything
    if (status === 'Active' || status === 'Inactive') {
      filter.status = status;
      filter.isActive = status === 'Active';
    } else if (status !== 'all') {
      filter.isActive = true;
      filter.status = 'Active';
    }

    if (type && type !== 'All')       filter.type = type;
    if (category && category !== 'All') filter.category = category;
    if (destination)                  filter.destination = { $regex: destination, $options: 'i' };
    if (country)                      filter.country = { $regex: country, $options: 'i' };
    if (featured === 'true')          filter.isFeatured = true;
    if (bestseller === 'true')        filter.isBestSeller = true;

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { title:            { $regex: search, $options: 'i' } },
        { destination:      { $regex: search, $options: 'i' } },
        { country:          { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category:         { $regex: search, $options: 'i' } },
        { packageId:        { $regex: search, $options: 'i' } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Duration range (by days)
    if (minDuration || maxDuration) {
      filter.durationDays = {};
      if (minDuration) filter.durationDays.$gte = Number(minDuration);
      if (maxDuration) filter.durationDays.$lte = Number(maxDuration);
    }

    // Sorting
    const sortObj = sort === 'price_asc'   ? { price: 1 }
                  : sort === 'price_desc'  ? { price: -1 }
                  : sort === 'rating'      ? { rating: -1 }
                  : sort === 'name_asc'    ? { title: 1 }
                  : sort === 'name_desc'   ? { title: -1 }
                  : sort === 'duration'    ? { durationDays: 1 }
                  : sort === 'newest'      ? { createdAt: -1 }
                  : sort === 'oldest'      ? { createdAt: 1 }
                  :                         { createdAt: -1 };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Package.countDocuments(filter);
    const packages = await Package.find(filter).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({
      packages,
      total,
      pages: Math.ceil(total / Number(limit)),
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get single package by ID ─────────────────────────────────────────────────
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    let pkg = null;

    // Try MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      pkg = await Package.findById(id);
    }
    // Try packageId (PKG-1001)
    if (!pkg) {
      pkg = await Package.findOne({ packageId: id });
    }
    // Try numericId (legacy)
    if (!pkg && !isNaN(id)) {
      pkg = await Package.findOne({ numericId: Number(id) });
    }

    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Create package (admin) ───────────────────────────────────────────────────
exports.createPackage = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle file uploads if using multipart/form-data
    if (req.files) {
      if (req.files.coverImage?.[0]) {
        data.coverImage = bufferToBase64(req.files.coverImage[0]);
        data.image = data.coverImage; // sync legacy
      }
      if (req.files.galleryImages?.length > 0) {
        data.galleryImages = req.files.galleryImages.map(f => bufferToBase64(f));
        data.images = data.galleryImages; // sync legacy
      }
    }

    // Parse JSON fields that may come as strings from multipart form
    const jsonFields = ['highlights', 'inclusions', 'exclusions', 'itinerary',
                        'hotelInfo', 'travelDates', 'galleryImages', 'images'];
    jsonFields.forEach(field => {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch (e) { /* ignore */ }
      }
    });

    // Parse transportInfo if string
    if (typeof data.transportInfo === 'string') {
      try { data.transportInfo = JSON.parse(data.transportInfo); } catch (e) { /* ignore */ }
    }

    // Parse numeric fields
    ['price', 'originalPrice', 'discountPercentage', 'durationDays', 'durationNights', 'availableSeats']
      .forEach(field => {
        if (data[field] !== undefined && data[field] !== '') data[field] = Number(data[field]);
      });

    // Parse boolean fields
    ['isFeatured', 'isBestSeller'].forEach(field => {
      if (typeof data[field] === 'string') data[field] = data[field] === 'true';
    });

    // Set isActive from status
    if (data.status === 'Active') data.isActive = true;
    else if (data.status === 'Inactive') data.isActive = false;

    const pkg = await Package.create(data);

    res.status(201).json({ success: true, message: 'Package created successfully', package: pkg });
  } catch (err) {
    console.error('Package creation error:', err);
    res.status(400).json({ message: err.message });
  }
};

// ── Update package (admin) ───────────────────────────────────────────────────
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid package id' });

    const data = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.coverImage?.[0]) {
        data.coverImage = bufferToBase64(req.files.coverImage[0]);
        data.image = data.coverImage;
      }
      if (req.files.galleryImages?.length > 0) {
        const newImages = req.files.galleryImages.map(f => bufferToBase64(f));
        // Append to existing gallery or replace
        if (data.appendGallery === 'true') {
          const existing = await Package.findById(id).select('galleryImages');
          data.galleryImages = [...(existing?.galleryImages || []), ...newImages];
        } else {
          data.galleryImages = newImages;
        }
        data.images = data.galleryImages;
      }
    }
    delete data.appendGallery;

    // Parse JSON fields
    const jsonFields = ['highlights', 'inclusions', 'exclusions', 'itinerary',
                        'hotelInfo', 'travelDates', 'galleryImages', 'images'];
    jsonFields.forEach(field => {
      if (typeof data[field] === 'string') {
        try { data[field] = JSON.parse(data[field]); } catch (e) { /* ignore */ }
      }
    });

    if (typeof data.transportInfo === 'string') {
      try { data.transportInfo = JSON.parse(data.transportInfo); } catch (e) { /* ignore */ }
    }

    // Parse numeric fields
    ['price', 'originalPrice', 'discountPercentage', 'durationDays', 'durationNights', 'availableSeats']
      .forEach(field => {
        if (data[field] !== undefined && data[field] !== '') data[field] = Number(data[field]);
      });

    // Parse boolean fields
    ['isFeatured', 'isBestSeller'].forEach(field => {
      if (typeof data[field] === 'string') data[field] = data[field] === 'true';
    });

    // Sync status ↔ isActive
    if (data.status === 'Active') data.isActive = true;
    else if (data.status === 'Inactive') data.isActive = false;

    const pkg = await Package.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    res.json({ success: true, message: 'Package updated successfully', package: pkg });
  } catch (err) {
    console.error('Package update error:', err);
    res.status(400).json({ message: err.message });
  }
};

// ── Delete package (admin) — hard delete ─────────────────────────────────────
exports.deletePackage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid package id' });

    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    res.json({ success: true, message: 'Package deleted permanently' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get featured packages (public) ───────────────────────────────────────────
exports.getFeaturedPackages = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const packages = await Package.find({ isFeatured: true, isActive: true, status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ packages, total: packages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get best seller packages (public) ────────────────────────────────────────
exports.getBestSellerPackages = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const packages = await Package.find({ isBestSeller: true, isActive: true, status: 'Active' })
      .sort({ rating: -1 })
      .limit(limit);
    res.json({ packages, total: packages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Package statistics (admin) ───────────────────────────────────────────────
exports.getPackageStats = async (req, res) => {
  try {
    const [total, active, inactive, featured, bestseller] = await Promise.all([
      Package.countDocuments(),
      Package.countDocuments({ status: 'Active' }),
      Package.countDocuments({ status: 'Inactive' }),
      Package.countDocuments({ isFeatured: true }),
      Package.countDocuments({ isBestSeller: true }),
    ]);

    // Category breakdown
    const categoryStats = await Package.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Destination breakdown (top 10)
    const destinationStats = await Package.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Price stats
    const priceStats = await Package.aggregate([
      { $group: {
        _id: null,
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      }}
    ]);

    res.json({
      total, active, inactive, featured, bestseller,
      categoryStats: categoryStats.map(c => ({ name: c._id || 'Uncategorized', count: c.count })),
      destinationStats: destinationStats.map(d => ({ name: d._id || 'Unknown', count: d.count })),
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Toggle featured (admin) ──────────────────────────────────────────────────
exports.toggleFeatured = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid package id' });

    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    pkg.isFeatured = !pkg.isFeatured;
    if (pkg.isFeatured) pkg.badge = 'Featured';
    else if (pkg.isBestSeller) pkg.badge = 'Best Seller';
    else pkg.badge = '';
    await pkg.save();

    res.json({ success: true, isFeatured: pkg.isFeatured, package: pkg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── Toggle best seller (admin) ───────────────────────────────────────────────
exports.toggleBestSeller = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid package id' });

    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    pkg.isBestSeller = !pkg.isBestSeller;
    if (pkg.isBestSeller) pkg.badge = 'Best Seller';
    else if (pkg.isFeatured) pkg.badge = 'Featured';
    else pkg.badge = '';
    await pkg.save();

    res.json({ success: true, isBestSeller: pkg.isBestSeller, package: pkg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── Search packages (public) ─────────────────────────────────────────────────
exports.searchPackages = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) return res.json({ packages: [], total: 0 });

    const filter = {
      isActive: true,
      status: 'Active',
      $or: [
        { title:            { $regex: q, $options: 'i' } },
        { destination:      { $regex: q, $options: 'i' } },
        { country:          { $regex: q, $options: 'i' } },
        { shortDescription: { $regex: q, $options: 'i' } },
        { category:         { $regex: q, $options: 'i' } },
        { packageId:        { $regex: q, $options: 'i' } },
      ],
    };

    const packages = await Package.find(filter).sort({ rating: -1 }).limit(Number(limit));
    res.json({ packages, total: packages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get unique destinations (public) ─────────────────────────────────────────
exports.getUniqueDestinations = async (req, res) => {
  try {
    const destinations = await Package.aggregate([
      { $match: { isActive: true, status: 'Active' } },
      { $group: { _id: '$destination', country: { $first: '$country' }, count: { $sum: 1 }, image: { $first: '$coverImage' } } },
      { $sort: { count: -1 } },
    ]);
    res.json(destinations.map(d => ({ name: d._id, country: d.country, packages: d.count, image: d.image || '' })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Get unique categories (public) ───────────────────────────────────────────
exports.getUniqueCategories = async (req, res) => {
  try {
    const categories = await Package.aggregate([
      { $match: { isActive: true, status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(categories.map(c => ({ name: c._id || 'Uncategorized', count: c.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ══════════════════════════════════════════════════════════════════════════════
//  BOOKINGS
// ══════════════════════════════════════════════════════════════════════════════

exports.createBooking = async (req, res) => {
  try {
    console.log('📝 Booking Request Received:', {
      body: req.body,
      user: req.user?._id,
      userName: req.user?.name
    });

    const { packageId, persons, travelDate, totalAmount, specialReq } = req.body;

    // Detailed validation
    if (!packageId) {
      console.log('❌ Validation Error: packageId missing');
      return res.status(400).json({ message: 'Package ID is required' });
    }
    
    if (!persons) {
      console.log('❌ Validation Error: persons missing');
      return res.status(400).json({ message: 'Number of persons is required' });
    }
    
    if (!travelDate) {
      console.log('❌ Validation Error: travelDate missing');
      return res.status(400).json({ message: 'Travel date is required' });
    }
    
    if (!totalAmount) {
      console.log('❌ Validation Error: totalAmount missing');
      return res.status(400).json({ message: 'Total amount is required' });
    }

    // Validate packageId
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      console.log('❌ Validation Error: Invalid package ID format');
      return res.status(400).json({ message: 'Invalid Package ID' });
    }
    
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      console.log('❌ Validation Error: Package not found in database:', packageId);
      return res.status(404).json({ message: 'Package Not Found' });
    }

    // Validate travel date is in future
    const selectedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      console.log('❌ Validation Error: Past date selected');
      return res.status(400).json({ message: 'Travel date cannot be in the past' });
    }

    // Validate persons count
    const personsNum = Number(persons);
    if (personsNum < 1 || personsNum > 50) {
      console.log('❌ Validation Error: Invalid persons count');
      return res.status(400).json({ message: 'Number of persons must be between 1 and 50' });
    }

    // Create booking
    const booking = await Booking.create({
      user:        req.user._id,
      package:     pkg._id,
      packageId:   pkg.numericId || null,
      packageName: pkg.title,
      destination: pkg.destination,
      persons:     personsNum,
      travelDate:  new Date(travelDate),
      totalAmount: Number(totalAmount),
      packagePrice: pkg.price,
      specialReq:  specialReq || '',
      status:      'Pending',
      paymentStatus: 'Unpaid',
    });

    console.log('✅ Booking created successfully:', {
      bookingId: booking._id,
      bookingIdString: booking.bookingId,
      user: req.user.name
    });

    // Create notification for admin
    try {
      await Notification.create({
        type: 'Booking',
        title: 'New Booking Submitted',
        message: `A new booking has been submitted for package "${pkg.title}" by ${req.user.name || 'a customer'}. Travel Date: ${new Date(travelDate).toLocaleDateString()}. Travelers: ${personsNum}. Total: $${Number(totalAmount).toLocaleString()}.`,
        data: { bookingId: booking._id, userId: req.user._id }
      });
      console.log('🔔 Admin notification created');
    } catch (notifErr) {
      console.error('⚠️ Failed to create notification:', notifErr.message);
    }

    res.status(201).json({ 
      success: true,
      message: 'Booking submitted successfully', 
      status: 'pending',
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        travelDate: booking.travelDate,
        totalAmount: booking.totalAmount,
        persons: booking.persons
      }
    });
  } catch (err) {
    console.error('❌ Booking creation failed:', {
      error: err.message,
      stack: err.stack
    });
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed: ' + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate booking detected' });
    }
    
    res.status(500).json({ 
      message: 'Failed to create booking. Please try again or contact support.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking
      .find({ user: req.user._id })
      .populate('package', 'title image coverImage destination duration price packageId')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    const formattedBookings = bookings.map(b => ({
      ...b.toObject(),
      packageTitle: b.package?.title || b.packageName || 'Custom Package',
      packageDestination: b.package?.destination || b.destination || 'N/A',
      packagePrice: b.package?.price || 0
    }));
    
    res.json(formattedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking
      .find()
      .populate('user',    'name email phone')
      .populate('package', 'title destination price image coverImage packageId')
      .sort({ createdAt: -1 });
    
    const formattedBookings = bookings.map(b => ({
      ...b.toObject(),
      packageTitle: b.package?.title || b.packageName || 'Custom Package',
      packageDestination: b.package?.destination || b.destination || 'N/A',
      packageImage: b.package?.coverImage || b.package?.image || '',
      packagePrice: b.package?.price || b.totalAmount / (b.persons || 1)
    }));
    
    res.json(formattedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid booking id' });

    const booking = await Booking.findById(req.params.id).populate('user package');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const { status, packagePrice, additionalCharges } = req.body;
    
    booking.status = status;
    
    if (status === 'Approved' && (packagePrice || additionalCharges)) {
      booking.packagePrice = packagePrice || booking.totalAmount;
      booking.additionalCharges = additionalCharges || 0;
      booking.totalAmount = (packagePrice || booking.totalAmount) + (additionalCharges || 0);
    }
    
    await booking.save();

    // Send notification to user based on status
    if (booking.user && booking.user._id) {
      let notifTitle = '';
      let notifMessage = '';
      const pkgTitle = booking.package?.title || booking.packageName || 'tour package';
      const dest = booking.package?.destination || booking.destination || 'your destination';
      
      if (status === 'Approved') {
        notifTitle = 'Booking Approved!';
        notifMessage = `Your booking for "${pkgTitle}" has been approved. Payment of $${booking.totalAmount.toLocaleString()} is pending. Proceed to payment.`;
      } else if (status === 'Denied') {
        notifTitle = 'Booking Rejected';
        notifMessage = `Your booking for "${pkgTitle}" was rejected. Please contact support or try another package.`;
      } else if (status === 'Completed') {
        notifTitle = 'Trip Completed!';
        notifMessage = `Your trip to "${dest}" has been completed. We hope you enjoyed your journey! Please share your experience.`;
      }
      
      if (notifTitle) {
        await Notification.create({
          type: 'Booking',
          title: notifTitle,
          message: notifMessage,
          data: { bookingId: booking._id, userId: booking.user._id }
        });
      }
    }

    res.json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── Payment ───────────────────────────────────────────────────────────────────

exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, transactionId } = req.body;

    if (!bookingId) return res.status(400).json({ message: 'bookingId is required' });
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      return res.status(400).json({ message: 'Invalid bookingId' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Approved') 
      return res.status(400).json({ message: 'Only approved bookings can be paid' });

    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    booking.paymentId = transactionId || 'TXN-' + Date.now().toString().slice(-8);
    await booking.save();

    await Payment.create({
      booking: booking._id,
      user: booking.user,
      amount: booking.totalAmount,
      method: paymentMethod || 'Card',
      transactionId: booking.paymentId,
      status: 'Success'
    });

    await Notification.create({
      type: 'Payment',
      title: 'Payment Successful',
      message: `Your payment for booking ${booking.bookingId} has been processed successfully.`,
      data: { bookingId: booking._id, userId: booking.user }
    });

    res.json({ message: 'Payment processed successfully', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTripStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid booking id' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.tripStatus = req.body.tripStatus;
    await booking.save();

    res.json({ message: 'Trip status updated successfully', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
