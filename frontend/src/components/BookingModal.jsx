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
                <FiX size={20} className="text-slate-650" />
              </button>

              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-extrabold mb-1.5 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Book Your Journey
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{pkg.title} - {pkg.destination}</p>
                  <p className="text-xl font-extrabold mt-3" style={{ color: 'var(--primary)' }}>
                    ${pkg.price?.toLocaleString()} <span className="text-xs font-semibold text-slate-450">per person</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {user && (
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/20 dark:border-blue-900/30 rounded-2xl p-4 mb-4">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400"><span className="font-bold uppercase tracking-wider mr-2">Booking as:</span> {user.name} ({user.email})</p>
                    </div>
                  )}
                  
                  {!isLoggedIn && (
                    <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 mb-4 flex items-center gap-3">
                      <FiAlertCircle className="text-rose-600 flex-shrink-0" size={20} />
                      <p className="text-xs font-bold text-rose-800 dark:text-rose-300">You need to login to book this package</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-2 text-slate-450 dark:text-slate-500 pl-1" htmlFor="travelDate">
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
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 ${
                            errors.travelDate ? 'border-red-400 bg-red-50/25' : 'border-slate-200 dark:border-slate-700'
                          } focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-xs font-bold`}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {errors.travelDate && (
                        <p className="text-[10px] font-bold text-red-650 mt-1.5 flex items-center gap-1.5 pl-1">
                          <FiAlertCircle size={12} />
                          {errors.travelDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-2 text-slate-450 dark:text-slate-500 pl-1" htmlFor="numberOfPeople">
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
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 ${
                            errors.numberOfPeople ? 'border-red-400 bg-red-50/25' : 'border-slate-200 dark:border-slate-700'
                          } focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-xs font-bold`}
                        />
                      </div>
                      {errors.numberOfPeople && (
                        <p className="text-[10px] font-bold text-red-650 mt-1.5 flex items-center gap-1.5 pl-1">
                          <FiAlertCircle size={12} />
                          {errors.numberOfPeople}
                        </p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-2 text-slate-450 dark:text-slate-500 pl-1">
                        Total Amount
                      </label>
                      <div className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40 font-extrabold text-slate-900 dark:text-white text-center text-lg">
                        ${(pkg.price * form.numberOfPeople).toLocaleString()}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center font-semibold">
                        ${pkg.price?.toLocaleString()} × {form.numberOfPeople} person(s)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest mb-2 text-slate-455 dark:text-slate-500 pl-1" htmlFor="specialRequests">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      value={form.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all resize-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 text-xs font-semibold"
                      rows="3"
                      maxLength="500"
                      placeholder="Any specific food choices, room requests, or details..."
                    />
                    <p className="text-[9px] font-bold text-slate-400 mt-1 text-right">
                      {form.specialRequests.length}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      style={{ color: '#6b7280' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isLoggedIn}
                      className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                      style={{ 
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.2)' 
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
                      ) : 'Confirm Booking'}
                    </button>
                  </div>
                  
                  {!isLoggedIn && (
                    <p className="text-[10px] text-center text-slate-500 mt-3 font-semibold">
                      Please <button type="button" onClick={() => { onClose(); navigate('/auth/user'); }} className="text-blue-600 dark:text-blue-400 hover:underline font-bold">login</button> to submit your booking
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
