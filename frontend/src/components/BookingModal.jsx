import { useState } from 'react';
import { FiX, FiCalendar, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, pkg }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    travelDate: '',
    numberOfPeople: 1,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.travelDate) {
      newErrors.travelDate = 'Please select a travel date';
    } else {
      const selectedDate = new Date(form.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.travelDate = 'Travel date cannot be in the past';
      }
    }
    
    if (!form.numberOfPeople || form.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'At least 1 person is required';
    } else if (form.numberOfPeople > 50) {
      newErrors.numberOfPeople = 'Maximum 50 people allowed per booking';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!isLoggedIn) {
      toast.error('Please login to book a package', {
        position: 'top-center',
        autoClose: 3000,
      });
      onClose();
      navigate('/auth/user');
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    
    try {
      const totalAmount = pkg.price * form.numberOfPeople;
      
      console.log('📦 Submitting booking:', {
        packageId: pkg._id || pkg.id,
        persons: form.numberOfPeople,
        travelDate: form.travelDate,
        totalAmount,
        specialReq: form.specialRequests
      });
      
      const res = await api.post('/bookings', {
        packageId: pkg._id || pkg.id,
        packageName: pkg.title,
        destination: pkg.destination,
        persons: form.numberOfPeople,
        travelDate: form.travelDate,
        totalAmount: totalAmount,
        specialReq: form.specialRequests
      });
      
      console.log('✅ Booking response:', res.data);
      
      toast.success('Booking submitted successfully! 🎉', {
        position: 'top-center',
        autoClose: 3000,
      });
      
      // Reset form
      setForm({ travelDate: '', numberOfPeople: 1, specialRequests: '' });
      setErrors({});
      
      // Close modal and navigate
      onClose();
      
      // Small delay for better UX
      setTimeout(() => {
        navigate('/dashboard/bookings');
      }, 500);
      
    } catch (err) {
      console.error('❌ Booking error:', err);
      
      // Handle specific error types
      if (err.isNetworkError) {
        toast.error('Cannot connect to server. Please check your internet connection or verify the backend is running.', {
          position: 'top-center',
          autoClose: 5000,
        });
      } else if (err.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: 'top-center',
          autoClose: 3000,
        });
        setTimeout(() => {
          onClose();
          navigate('/auth/user');
        }, 1000);
      } else if (err.status === 404) {
        toast.error('Package not found. Please refresh the page and try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
      } else if (err.status === 400) {
        toast.error(err.response?.data?.message || 'Invalid booking data. Please check all fields.', {
          position: 'top-center',
          autoClose: 4000,
        });
      } else {
        toast.error(err.response?.data?.message || 'Booking request failed. Please try again.', {
          position: 'top-center',
          autoClose: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-slate-100"
                aria-label="Close modal"
              >
                <FiX size={20} className="text-slate-600" />
              </button>

              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-light mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                    Book Your Journey
                  </h2>
                  <p className="text-sm text-slate-600">{pkg.title} - {pkg.destination}</p>
                  <p className="text-lg font-semibold mt-2" style={{ color: '#7C3AED' }}>
                    ${pkg.price?.toLocaleString()} per person
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {user && (
                    <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-[#7C3AED]"><span className="font-semibold">Booking as:</span> {user.name} ({user.email})</p>
                    </div>
                  )}
                  
                  {!isLoggedIn && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                      <FiAlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                      <p className="text-sm text-amber-800">You need to login to book this package</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-xs font-semibold mb-2 text-slate-700" htmlFor="travelDate">
                        Travel Date *
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="travelDate"
                          type="date"
                          required
                          value={form.travelDate}
                          onChange={(e) => handleInputChange('travelDate', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.travelDate ? 'border-red-400 bg-red-50' : 'border-slate-200'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {errors.travelDate && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          {errors.travelDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2 text-slate-700" htmlFor="numberOfPeople">
                        Number of People *
                      </label>
                      <div className="relative">
                        <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max="50"
                          required
                          value={form.numberOfPeople}
                          onChange={(e) => handleInputChange('numberOfPeople', parseInt(e.target.value) || 1)}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.numberOfPeople ? 'border-red-400 bg-red-50' : 'border-slate-200'
                          } focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all`}
                        />
                      </div>
                      {errors.numberOfPeople && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          {errors.numberOfPeople}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold mb-2 text-slate-700">
                        Total Amount
                      </label>
                      <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 text-center">
                        ${(pkg.price * form.numberOfPeople).toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        ${pkg.price?.toLocaleString()} × {form.numberOfPeople} person(s)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2 text-slate-700" htmlFor="specialRequests">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      value={form.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all resize-none text-center"
                      rows="3"
                      maxLength="500"
                      placeholder=""
                    />
                    <p className="text-xs text-slate-400 mt-1 text-right">
                      {form.specialRequests.length}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: '#6b7280' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isLoggedIn}
                      className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ 
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b, #fbbf24)', 
                        color: '#0f172a', 
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(245,158,11,0.3)' 
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : 'Submit Request'}
                    </button>
                  </div>
                  
                  {!isLoggedIn && (
                    <p className="text-xs text-center text-slate-500 mt-2">
                      Please <button type="button" onClick={() => { onClose(); navigate('/auth/user'); }} className="text-[#7C3AED] hover:underline font-semibold">login</button> to submit your booking
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
