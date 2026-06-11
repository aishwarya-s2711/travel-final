import { useState, useEffect } from 'react';
import { FiStar, FiUser, FiPackage, FiMessageSquare, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews/all');
      setReviews(res.data || []);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (review) => {
    setReplyModal(review);
    setReplyText(review.adminReply || '');
  };

  const submitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/reviews/${replyModal._id}/reply`, { reply: replyText });
      toast.success('Reply sent successfully!');
      setReplyModal(null);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <FiStar
            key={star}
            size={14}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>
        <p className="text-xs text-slate-500 mt-1">View and reply to customer reviews</p>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
            <p className="text-slate-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{review.user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">{review.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-slate-600">({review.rating}/5)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                    <FiPackage size={14} />
                    <span className="font-medium">{review.package?.title || 'Unknown Package'}</span>
                  </div>

                  <p className="text-slate-700 mb-4">{review.comment}</p>

                  {review.adminReply && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Admin Reply:</p>
                      <p className="text-sm text-blue-800">{review.adminReply}</p>
                      <p className="text-xs text-blue-600 mt-2">
                        Replied on {new Date(review.repliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleReply(review)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  <FiMessageSquare size={14} />
                  {review.adminReply ? 'Edit Reply' : 'Reply'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
                <span>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</span>
                {review.booking && (
                  <span className="font-mono">Booking: {review.booking.bookingId}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Reply to Review</h2>
              <button
                onClick={() => setReplyModal(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Review Content */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-semibold text-slate-900">{replyModal.user?.name}</p>
                  {renderStars(replyModal.rating)}
                </div>
                <p className="text-sm text-slate-700">{replyModal.comment}</p>
              </div>

              {/* Reply Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                  placeholder=""
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={submitReply}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                  onClick={() => setReplyModal(null)}
                  className="px-8 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
