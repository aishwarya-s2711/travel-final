import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdHistory, MdLocationOn, MdDateRange, MdPayment, MdExplore, MdStarRate } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const TravelHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my');
      const allBookings = Array.isArray(response.data) ? response.data : (response.data?.bookings || []);
      
      const now = new Date();
      // Completed trips: travel date is in the past, or status is explicitly completed
      const completedTrips = allBookings.filter(b => {
        const isPast = b?.travelDate && new Date(b.travelDate) < now;
        const isCompleted = b.status && (b.status.toLowerCase() === 'completed' || b.status.toLowerCase() === 'confirmed');
        return isPast || isCompleted;
      });

      // Sort by travel date descending
      completedTrips.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate));
      
      setHistory(completedTrips);
      setError(null);
    } catch (err) {
      console.error('Error fetching travel history:', err);
      setError('Failed to load your travel history.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(n => (
        <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl"></div>
          <div className="flex-1 space-y-4 py-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
            <MdHistory className="text-blue-600" /> Travel History
          </h1>
          <p className="text-gray-600">Look back at your past adventures and completed trips.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
          {history.length} Trips Completed
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-200 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <MdHistory className="text-5xl text-blue-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] mb-3">No Travel History Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            You haven't completed any trips with us yet. It's time to start planning your first adventure!
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <MdExplore className="text-xl" /> Explore Packages
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((trip) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                {/* Fallback image if no package image is available in booking */}
                <img
                  src={trip.package?.coverImage || 'https://via.placeholder.com/400x300?text=Trip'}
                  alt={trip.packageName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                  <MdStarRate className="text-yellow-500" /> Completed
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#0F172A]">{trip.packageName}</h3>
                    <span className="text-lg font-bold text-green-600">${trip.totalAmount}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-gray-400 text-lg" />
                      <span>{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdDateRange className="text-gray-400 text-lg" />
                      <span>{formatDate(trip.travelDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdPayment className="text-gray-400 text-lg" />
                      <span>Payment: <strong className="text-gray-800 capitalize">{trip.paymentStatus}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Booking ID: {trip.bookingId || trip._id}</p>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition">
                    Leave a Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelHistory;
