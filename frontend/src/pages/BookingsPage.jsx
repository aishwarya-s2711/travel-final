import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiCreditCard, FiX, FiStar } from 'react-icons/fi';
import { MdRateReview } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../utils/api';
import BookingProgress from '../components/BookingProgress';

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      setBookings(res.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.status === 'Pending';
    if (filter === 'approved') return b.status === 'Approved';
    if (filter === 'completed') return b.status === 'Completed';
    return true;
  });

  const handlePayNow = (booking) => {
    navigate(`/payment/${booking._id}`);
  };

  const handleReview = (booking) => {
    setReviewModal(booking);
    setRating(5);
    setComment('');
  };

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        bookingId: reviewModal._id,
        packageId: reviewModal.package._id,
        rating,
        comment
      });
      
      toast.success('Review submitted successfully!');
      setReviewModal(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Approved: 'bg-green-100 text-green-700 border-green-200',
      Denied: 'bg-red-100 text-red-700 border-red-200',
      Completed: 'bg-blue-100 text-blue-700 border-blue-200',
      Cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: 'text-green-600',
      Unpaid: 'text-orange-600',
      Refunded: 'text-gray-600'
    };
    return colors[status] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 fade-in">
      <div className="mb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your travel bookings</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'completed', label: 'Completed' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                filter === f.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <Link
              to="/packages"
              className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Package Image */}
                  <img
                    src={booking.package?.image || 'https://via.placeholder.com/200'}
                    alt={booking.package?.title}
                    className="w-full lg:w-48 h-48 object-cover rounded-xl"
                  />

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {booking.package?.title || 'Package'}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">ID: {booking.bookingId}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiCalendar className="text-blue-600" />
                        <span className="text-sm">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="text-blue-600" />
                        <span className="text-sm">{booking.package?.destination || 'Destination'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiUsers className="text-blue-600" />
                        <span className="text-sm">{booking.persons} Traveler(s)</span>
                      </div>
                    </div>

                    <BookingProgress booking={booking} />

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                        <p className={`font-bold text-lg ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{booking.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      {booking.status === 'Approved' && booking.paymentStatus === 'Unpaid' && (
                        <button
                          onClick={() => handlePayNow(booking)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                          <FiCreditCard />
                          Pay Now
                        </button>
                      )}
                      
                      {booking.status === 'Completed' && !booking.reviewSubmitted && (
                        <button
                          onClick={() => handleReview(booking)}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                        >
                          <MdRateReview />
                          Write Review
                        </button>
                      )}

                      {booking.paymentStatus === 'Paid' && (
                        <Link
                          to={`/track-trip?bookingId=${booking.bookingId}`}
                          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Track Trip
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                <button
                  onClick={() => setReviewModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{reviewModal.package?.title}</h3>
                <p className="text-sm text-gray-600">Share your experience with this trip</p>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar
                        size={32}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  placeholder=""
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitReview}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setReviewModal(null)}
                  className="px-8 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
