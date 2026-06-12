import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdClose, MdPerson, MdEmail, MdPhone, MdLocationOn, 
  MdCalendarToday, MdPeople, MdNotes, MdCheckCircle 
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const BookingForm = ({ isOpen, onClose, packageData, destinationData }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    packageName: '',
    travelDate: '',
    numberOfTravelers: 1,
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        destination: destinationData?.name || packageData?.destination || '',
        packageName: packageData?.name || packageData?.title || ''
      }));
    }
  }, [isOpen, user, packageData, destinationData]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required (minimum 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    if (!formData.destination || formData.destination.trim().length < 2) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.travelDate) {
      newErrors.travelDate = 'Travel date is required';
    } else {
      const selectedDate = new Date(formData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.travelDate = 'Travel date must be in the future';
      }
    }

    if (!formData.numberOfTravelers || formData.numberOfTravelers < 1) {
      newErrors.numberOfTravelers = 'At least 1 traveler is required';
    } else if (formData.numberOfTravelers > 50) {
      newErrors.numberOfTravelers = 'Maximum 50 travelers allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);

      const bookingPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        destination: formData.destination,
        packageName: formData.packageName || 'Custom Package',
        startDate: formData.travelDate,
        numberOfTravelers: parseInt(formData.numberOfTravelers),
        specialRequests: formData.specialRequests || 'None',
        status: 'pending'
      };

      const response = await api.post('/bookings/create', bookingPayload);

      if (response.data.success) {
        setSuccess(true);
        toast.success('Booking request submitted successfully!');
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          // Optionally redirect to dashboard
          // window.location.href = '/dashboard';
        }, 3000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl my-8 overflow-hidden transition-colors border border-slate-100 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success State */}
              {success ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center"
                  >
                    <MdCheckCircle className="text-6xl text-green-600 dark:text-green-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Booking Submitted!</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-350 mb-2 font-medium">
                    Your booking request has been submitted successfully.
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
                    Waiting for admin approval. You'll receive a notification once it's reviewed.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-premium w-full max-w-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Book Your Trip</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in your details to proceed with booking</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <MdClose className="text-2xl" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white dark:bg-slate-900">
                    {/* Name */}
                    <div>
                      <div className="premium-input-container">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder=" "
                          className={`premium-input ${
                            errors.name
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                        <MdPerson className="input-icon text-xl" />
                        <label className="premium-label">Full Name *</label>
                      </div>
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.name}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <div className="premium-input-container">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=" "
                            className={`premium-input ${
                              errors.email
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          />
                          <MdEmail className="input-icon text-xl" />
                          <label className="premium-label">Email Address *</label>
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <div className="premium-input-container">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder=" "
                            className={`premium-input ${
                              errors.phone
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          />
                          <MdPhone className="input-icon text-xl" />
                          <label className="premium-label">Phone Number *</label>
                        </div>
                        {errors.phone && (
                          <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <div className="premium-input-container">
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder=" "
                          className={`premium-input ${
                            errors.destination
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                        <MdLocationOn className="input-icon text-xl" />
                        <label className="premium-label">Destination *</label>
                      </div>
                      {errors.destination && (
                        <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.destination}</p>
                      )}
                    </div>

                    {/* Travel Date & Number of Travelers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Travel Date */}
                      <div>
                        <div className="premium-input-container">
                          <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            placeholder=" "
                            className={`premium-input ${
                              errors.travelDate
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          />
                          <MdCalendarToday className="input-icon text-xl" />
                          <label className="premium-label">Travel Date *</label>
                        </div>
                        {errors.travelDate && (
                          <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.travelDate}</p>
                        )}
                      </div>

                      {/* Number of Travelers */}
                      <div>
                        <div className="premium-input-container">
                          <input
                            type="number"
                            name="numberOfTravelers"
                            value={formData.numberOfTravelers}
                            onChange={handleChange}
                            min="1"
                            max="50"
                            placeholder=" "
                            className={`premium-input ${
                              errors.numberOfTravelers
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25'
                                : 'border-slate-200 dark:border-slate-700'
                            }`}
                          />
                          <MdPeople className="input-icon text-xl" />
                          <label className="premium-label">Number of Travelers *</label>
                        </div>
                        {errors.numberOfTravelers && (
                          <p className="mt-1.5 text-xs text-rose-500 font-semibold pl-2">{errors.numberOfTravelers}</p>
                        )}
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 pl-2">
                        Special Requests (Optional)
                      </label>
                      <div className="relative flex items-start">
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          placeholder="Tell us about any preferences, diet requirements or details..."
                          rows="3"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all resize-none text-sm placeholder-slate-400 dark:placeholder-slate-500"
                        />
                        <MdNotes className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 text-xl pointer-events-none" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-14 px-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn-premium h-14 text-xs font-bold uppercase tracking-wider"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          'Submit Booking'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingForm;
