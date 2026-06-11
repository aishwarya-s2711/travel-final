import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, MessageSquare, Clock, Navigation, MapPinIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TrackTrip = () => {
  const [bookingId, setBookingId] = useState('');
  const [tripFound, setTripFound] = useState(false);
  const [activeStep, setActiveStep] = useState(4);

  const tripSteps = [
    { id: 1, label: 'Booking Confirmed', icon: '✅' },
    { id: 2, label: 'Payment Completed', icon: '✅' },
    { id: 3, label: 'Hotel Reserved', icon: '✅' },
    { id: 4, label: 'Flight/Transport Confirmed', icon: '✅' },
    { id: 5, label: 'Trip Started', icon: '🚀' },
    { id: 6, label: 'Destination Reached', icon: '📍' },
  ];

  const tripDetails = {
    destination: 'Maldives',
    destinationImage: 'https://images.unsplash.com/photo-1511689915661-a8f9fa7d8a7d?w=500&h=300&fit=crop',
    travelDates: 'Dec 15 - Dec 22, 2024',
    travelers: 2,
    status: 'In Progress',
    packageType: 'Premium All-Inclusive',
    bookingId: 'BK2024001',
    currentLocation: 'En route to Male Airport',
    coordinates: { lat: '4.1755', lng: '73.5093' }
  };

  const supportItems = [
    { icon: Phone, label: 'Call Us', value: '+1-800-TRAVEL-GO', bgColor: '#eff6ff', borderColor: '#bfdbfe', iconColor: '#2563eb' },
    { icon: MessageSquare, label: 'Live Chat', value: 'Available Now', bgColor: '#f0fdf4', borderColor: '#bbf7d0', iconColor: '#16a34a' },
    { icon: Mail, label: 'Email', value: 'support@travelgo.com', bgColor: '#faf5ff', borderColor: '#e9d5ff', iconColor: '#9333ea' },
    { icon: Clock, label: '24/7 Support', value: 'Always Available', bgColor: '#fffbeb', borderColor: '#fcd34d', iconColor: '#ea580c' },
  ];

  const handleSearch = () => {
    if (bookingId.trim()) {
      setTripFound(true);
    }
  };

  const progressPercentage = (activeStep / tripSteps.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Track Your Trip
            </h1>
            <p className="text-lg text-gray-600">Monitor your journey in real-time.</p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="flex flex-col gap-4">
                <label className="text-gray-700 font-semibold">Enter Booking ID or Trip ID</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder=""
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 placeholder-gray-400"
                    />
                    <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSearch}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
                  >
                    Track Trip
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trip Content - Show after search */}
          <AnimatePresence>
            {tripFound && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                {/* Progress Timeline */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-lg border border-white/20"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Trip Progress</h2>
                  
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm text-gray-600">Trip Status</span>
                      <span className="text-sm font-semibold text-blue-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      />
                    </div>
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {tripSteps.map((step, idx) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`text-center p-4 rounded-xl transition-all ${
                          step.id <= activeStep
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="text-3xl mb-2">{step.icon}</div>
                        <p className={`text-sm font-medium ${step.id <= activeStep ? 'text-blue-700' : 'text-gray-600'}`}>
                          {step.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Trip Details Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="backdrop-blur-xl bg-white/80 rounded-2xl overflow-hidden shadow-lg border border-white/20"
                  >
                    <img
                      src={tripDetails.destinationImage}
                      alt={tripDetails.destination}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">{tripDetails.destination}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                          <span className="text-gray-600">Travel Dates</span>
                          <span className="font-semibold text-gray-900">{tripDetails.travelDates}</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                          <span className="text-gray-600">Travelers</span>
                          <span className="font-semibold text-gray-900">{tripDetails.travelers} People</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                          <span className="text-gray-600">Booking Status</span>
                          <span className="inline-flex items-center gap-2 font-semibold text-green-600">
                            ✓ {tripDetails.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Package Type</span>
                          <span className="font-semibold text-gray-900">{tripDetails.packageType}</span>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                        <p className="text-lg font-mono font-semibold text-blue-600">{tripDetails.bookingId}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Live Status & Location */}
                  <div className="space-y-6">
                    {/* Live Status */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-lg border border-white/20"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Live Trip Status</h3>
                      
                      <div className="space-y-4">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Navigation className="w-8 h-8 text-blue-600" />
                          </motion.div>
                          <div>
                            <p className="font-semibold text-gray-900">Current Location</p>
                            <p className="text-sm text-gray-600">{tripDetails.currentLocation}</p>
                          </div>
                        </motion.div>

                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200"
                        >
                          <MapPinIcon className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="font-semibold text-gray-900">Destination</p>
                            <p className="text-sm text-gray-600">{tripDetails.destination}</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Map Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="backdrop-blur-xl bg-white/80 rounded-2xl overflow-hidden shadow-lg border border-white/20"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 p-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full blur-2xl"></div>
                          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-300 rounded-full blur-2xl"></div>
                        </div>
                        
                        <div className="relative text-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mb-4"
                          >
                            <MapPin className="w-16 h-16 text-blue-600" />
                          </motion.div>
                          <p className="font-semibold text-gray-800 mb-1">Live GPS Tracking</p>
                          <p className="text-sm text-gray-600">
                            Lat: {tripDetails.coordinates.lat} | Lng: {tripDetails.coordinates.lng}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Customer Support */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-lg border border-white/20"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">24/7 Customer Support</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {supportItems.map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          borderColor: item.borderColor,
                          borderWidth: '1px'
                        }}
                        className="p-6 rounded-xl transition-all group bg-white hover:shadow-lg"
                      >
                        <div 
                          style={{
                            backgroundColor: item.bgColor,
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                          }}
                          className="group-hover:shadow-md transition-all"
                        >
                          <item.icon style={{ color: item.iconColor }} className="w-6 h-6" />
                        </div>
                        <p className="font-semibold text-gray-900 mb-2">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.value}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackTrip;
