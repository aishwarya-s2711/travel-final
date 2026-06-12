import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiShoppingBag, FiUser, FiHeart, FiCreditCard, FiCompass, FiSettings,
  FiCalendar, FiMapPin, FiUsers, FiArrowRight, FiCheckCircle, FiClock,
  FiXCircle, FiTrendingUp, FiDownload, FiMap
} from 'react-icons/fi';
import api from '../../utils/api';
import BookingProgress from '../../components/BookingProgress';
import { useAuth } from '../../context/AuthContext';

const UserOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [statsLoading, setStatsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    savedDestinations: 3
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/bookings/my');
      const bookings = Array.isArray(response.data) ? response.data : (response.data?.bookings || []);
      
      const now = new Date();
      const upcoming = bookings.filter(b => b?.travelDate && new Date(b.travelDate) > now);
      const completed = bookings.filter(b => b?.travelDate && new Date(b.travelDate) < now);
      
      setStats({
        totalTrips: bookings.length,
        upcomingTrips: upcoming.length,
        completedTrips: completed.length,
        savedDestinations: 3
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await api.get('/bookings/my');
      const bookings = Array.isArray(response.data) ? response.data : (response.data?.bookings || []);
      
      const now = new Date();
      const upcoming = bookings
        .filter(b => b?.travelDate && new Date(b.travelDate) > now)
        .slice(0, 4)
        .map(booking => ({
          id: booking._id || booking.id,
          title: booking.packageName || 'Travel Package',
          destination: booking.destination || 'Unknown',
          startDate: booking.travelDate,
          endDate: booking.endDate,
          travelers: booking.persons || 1,
          status: booking.status || 'Pending',
          paymentStatus: booking.paymentStatus || 'Unpaid',
          bookingId: booking.bookingId || booking._id || 'N/A',
          totalPrice: booking.totalAmount || 0,
          originalBooking: booking
        }));
      
      setUpcomingBookings(upcoming);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      setDestinationsLoading(true);
      const response = await api.get('/public/destinations');
      const destinations = response.data?.destinations || response.data || [];
      setPopularDestinations(destinations.slice(0, 3));
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setDestinationsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUpcomingBookings();
    fetchDestinations();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': 
      case 'approved': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-55/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'pending': 
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-55/10 dark:text-amber-400 dark:border-amber-55/20';
      case 'cancelled': 
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default: 
        return 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const statsCards = [
    { id: 1, label: 'Total Trips', value: stats.totalTrips, icon: FiCompass },
    { id: 2, label: 'Upcoming Trips', value: stats.upcomingTrips, icon: FiCalendar },
    { id: 3, label: 'Saved Destinations', value: stats.savedDestinations, icon: FiHeart },
    { id: 4, label: 'Completed Trips', value: stats.completedTrips, icon: FiCheckCircle },
  ];

  const quickActions = [
    { label: 'Book Trip', icon: FiCalendar, to: '/packages' },
    { label: 'Explore', icon: FiMap, to: '/packages' },
    { label: 'Track Booking', icon: FiMapPin, to: '/track-trip' },
    { label: 'Wishlist', icon: FiHeart, to: '/dashboard/wishlist' },
  ];

  const recentActivity = [
    { title: 'New Trip Booked', description: 'Maldives villa tour successfully submitted.', date: 'Just now', icon: FiCalendar, color: 'text-blue-600 bg-blue-50' },
    { title: 'Payment Confirmed', description: 'Paid successfully for Booking ID TX-9011.', date: '2 hours ago', icon: FiCreditCard, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Added to Wishlist', description: 'Saved Swiss Scenic itinerary details.', date: 'Yesterday', icon: FiHeart, color: 'text-rose-600 bg-rose-50' }
  ];

  const LoadingSkeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl ${className}`}></div>
  );

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Welcome Card (Clean minimal white card style) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] dark:text-white">
            Welcome back, {user?.name || 'Explorer'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your itineraries, bookings, and track active routes.</p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/packages" 
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            Explore Tours
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards (Subtle shadows, white backgrounds, 16px radius) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-[#E2E8F0] dark:border-slate-800/80 h-28">
              <LoadingSkeleton className="h-4 w-20 mb-3" />
              <LoadingSkeleton className="h-6 w-12" />
            </div>
          ))
        ) : (
          statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-slate-700/60 text-[#2563EB]">
                    <Icon size={14} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white leading-none">{stat.value}</h3>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 3. Analytics & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics Section - Monochrome Blue style */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">Monthly Bookings & Spend</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Visual analytics of booking events and travel activity</p>
            </div>
            <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              Live Charts
            </span>
          </div>

          {/* Simple monochrome SVG Bar chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { m: 'Jan', val: 35 },
              { m: 'Feb', val: 40 },
              { m: 'Mar', val: 80 },
              { m: 'Apr', val: 65 },
              { m: 'May', val: 95 },
              { m: 'Jun', val: 110 }
            ].map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full flex justify-center items-end h-32">
                  <div 
                    className="w-4 rounded-t-lg bg-[#2563EB] opacity-90 group-hover:bg-[#1D4ED8] transition-all shadow-xs"
                    style={{ height: `${item.val}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-550">{item.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions (White bg, icon buttons) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl hover:border-blue-500 hover:shadow-xs transition-all text-center group"
                >
                  <div className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-[#2563EB] group-hover:scale-105 transition-all shadow-xs">
                    <Icon size={16} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mt-2.5 group-hover:text-[#2563EB]">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Upcoming Trips & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Trips layout (Clean Table details) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white mb-5">Upcoming Trips</h3>
          
          {bookingsLoading ? (
            <div className="space-y-4">
              <LoadingSkeleton className="h-5 w-40" />
              <LoadingSkeleton className="h-12 w-full" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center text-slate-300">
                <FiCompass size={22} />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">No upcoming trips booked yet.</p>
              <Link to="/packages" className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all">
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-1">Destination</th>
                    <th className="py-3 px-1">Travel Date</th>
                    <th className="py-3 px-1">Travelers</th>
                    <th className="py-3 px-1 text-center">Status</th>
                    <th className="py-3 px-1 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-all">
                      <td className="py-3.5 px-1 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=100&q=80" alt={booking.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="truncate max-w-[150px]" title={booking.title}>{booking.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-1 font-semibold text-slate-500 dark:text-slate-400">{formatDate(booking.startDate)}</td>
                      <td className="py-3.5 px-1 text-slate-500 dark:text-slate-400">{booking.travelers} Traveler(s)</td>
                      <td className="py-3.5 px-1 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-1 text-right">
                        <button 
                          onClick={() => navigate('/dashboard/bookings')}
                          className="p-1 rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-slate-50"
                        >
                          <FiArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white mb-4">Activity Timeline</h3>
          <div className="space-y-4 flex-1">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                      <Icon size={12} />
                    </div>
                    {index < recentActivity.length - 1 && (
                      <div className="w-0.5 h-10 bg-slate-100 dark:bg-slate-700 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <h4 className="font-semibold text-xs text-[#0F172A] dark:text-white leading-tight mb-0.5">{activity.title}</h4>
                    <p className="text-[10px] text-slate-450 dark:text-slate-400">{activity.description}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{activity.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
