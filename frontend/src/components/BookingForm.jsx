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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success State */}
              {success ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <MdCheckCircle className="text-6xl text-green-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted!</h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Your booking request has been submitted successfully.
                  </p>
                  <p className="text-base text-gray-500 mb-8">
                    Waiting for admin approval. You'll receive a notification once it's reviewed.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Book Your Trip</h2>
                      <p className="text-sm text-gray-600 mt-1">Fill in your details to proceed with booking</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                      <MdClose className="text-2xl" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder=""
                          className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                            errors.name
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-gray-200 focus:border-[#7C3AED]'
                          } focus:outline-none`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=""
                            className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                              errors.email
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-[#7C3AED]'
                            } focus:outline-none`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder=""
                            className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                              errors.phone
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-[#7C3AED]'
                            } focus:outline-none`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Destination *
                      </label>
                      <div className="relative">
                        <MdLocationOn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder=""
                          className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                            errors.destination
                              ? 'border-red-300 focus:border-red-500'
                              : 'border-gray-200 focus:border-[#7C3AED]'
                          } focus:outline-none`}
                        />
                      </div>
                      {errors.destination && (
                        <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
                      )}
                    </div>

                    {/* Travel Date & Number of Travelers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Travel Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Travel Date *
                        </label>
                        <div className="relative">
                          <MdCalendarToday className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                          <input
                            type="date"
                            name="travelDate"
                            value={formData.travelDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                              errors.travelDate
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-[#7C3AED]'
                            } focus:outline-none`}
                          />
                        </div>
                        {errors.travelDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.travelDate}</p>
                        )}
                      </div>

                      {/* Number of Travelers */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Number of Travelers *
                        </label>
                        <div className="relative">
                          <MdPeople className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                          <input
                            type="number"
                            name="numberOfTravelers"
                            value={formData.numberOfTravelers}
                            onChange={handleChange}
                            min="1"
                            max="50"
                            className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 transition-all ${
                              errors.numberOfTravelers
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-[#7C3AED]'
                            } focus:outline-none`}
                          />
                        </div>
                        {errors.numberOfTravelers && (
                          <p className="mt-1 text-sm text-red-600">{errors.numberOfTravelers}</p>
                        )}
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <div className="relative">
                        <MdNotes className="absolute left-4 top-4 text-gray-400 text-xl" />
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          placeholder=""
                          rows="4"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#7C3AED] focus:outline-none resize-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-12 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-12 px-6 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
