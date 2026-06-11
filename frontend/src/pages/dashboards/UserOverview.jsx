import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MdDashboard, MdBook, MdFavorite, MdCalendarToday, MdCheckCircle,
  MdLocationOn, MdPeople, MdChevronRight, MdMoreVert, MdExplore,
  MdCardGiftcard, MdAccessTime
} from 'react-icons/md';
import api from '../../utils/api';
import BookingProgress from '../../components/BookingProgress';
import { useAuth } from '../../context/AuthContext';

const UserOverview = () => {
  const { user } = useAuth();
  
  // State management
  const [statsLoading, setStatsLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    savedDestinations: 0
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setError(null);
      const response = await api.get('/bookings/my');
      const bookings = Array.isArray(response.data) ? response.data : (response.data?.bookings || []);
      
      const now = new Date();
      const upcoming = bookings.filter(b => b?.travelDate && new Date(b.travelDate) > now);
      const completed = bookings.filter(b => b?.travelDate && new Date(b.travelDate) < now);
      
      setStats({
        totalTrips: bookings.length,
        upcomingTrips: upcoming.length,
        completedTrips: completed.length,
        savedDestinations: 0
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
      
      const activities = bookings.slice(0, 5).map(booking => ({
        id: booking._id || Math.random().toString(),
        type: 'booking',
        title: `Booked ${booking.packageName || 'Travel Package'}`,
        description: booking.destination || 'Travel destination',
        date: booking.createdAt || booking.travelDate,
        icon: MdBook
      }));
      setRecentActivity(activities);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      setDestinationsLoading(true);
      const response = await api.get('/destinations');
      const destinations = response.data?.destinations || [];
      setPopularDestinations(destinations.slice(0, 6));
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
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statsCards = [
    { id: 1, label: 'Total Trips', value: stats.totalTrips, icon: MdDashboard, change: `${stats.upcomingTrips} upcoming`, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 2, label: 'Upcoming Trips', value: stats.upcomingTrips, icon: MdCalendarToday, change: 'Next 30 days', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 3, label: 'Completed Trips', value: stats.completedTrips, icon: MdCheckCircle, change: 'All time', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 4, label: 'Saved Destinations', value: stats.savedDestinations, icon: MdFavorite, change: 'In wishlist', color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const quickActions = [
    { id: 1, label: 'Book New Trip', icon: MdCalendarToday, to: '/packages', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 2, label: 'Explore Destinations', icon: MdExplore, to: '/destinations', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 3, label: 'Track Trip', icon: MdLocationOn, to: '/track-trip', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 4, label: 'View All Bookings', icon: MdBook, to: '/dashboard/bookings', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  const LoadingSkeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );

  const EmptyState = ({ icon: Icon, title, description, actions }) => (
    <div className="bg-white rounded-2xl p-16 border border-gray-200 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
        <Icon className="text-5xl text-gray-300" />
      </div>
      <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              action.primary ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {action.icon && <action.icon className="text-xl" />}
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-blue-400">{user?.name || 'User'}</span>!
        </h1>
        <p className="text-slate-300">Manage your trips, bookings and explore new destinations.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
              <LoadingSkeleton className="h-6 w-24 mb-3" />
              <LoadingSkeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    <Icon className="text-lg" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Bookings */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Upcoming Trips</h2>
              <Link to="/dashboard/bookings" className="text-[#2563EB] hover:text-blue-700 text-base font-bold flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                View all <MdChevronRight />
              </Link>
            </div>

            {bookingsLoading ? (
              <div className="grid gap-6">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                    <LoadingSkeleton className="h-7 w-56 mb-6" />
                    <LoadingSkeleton className="h-5 w-full mb-3" />
                    <LoadingSkeleton className="h-5 w-3/4" />
                  </div>
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <EmptyState
                icon={MdBook}
                title="No Upcoming Trips"
                description="You don't have any trips planned yet. Start exploring amazing destinations and book your next adventure!"
                actions={[
                  { label: 'Browse Packages', to: '/packages', icon: MdCardGiftcard, primary: true },
                  { label: 'Explore Destinations', to: '/destinations', icon: MdExplore },
                ]}
              />
            ) : (
              <div className="grid gap-4">
                {upcomingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-3">{booking.title}</h3>
                        <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <MdCalendarToday className="text-lg text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Dates</p>
                              <p className="font-medium text-gray-700 text-sm">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                            </div>
                          </span>
                          <span className="flex items-center gap-2">
                            <MdLocationOn className="text-lg text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Destination</p>
                              <p className="font-medium text-gray-700">{booking.destination}</p>
                            </div>
                          </span>
                          <span className="flex items-center gap-2">
                            <MdPeople className="text-lg text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Travelers</p>
                              <p className="font-medium text-gray-700">{booking.travelers} {booking.travelers === 1 ? 'Person' : 'People'}</p>
                            </div>
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-2">
                        <MdMoreVert className="text-2xl" />
                      </button>
                    </div>
                    
                    <div className="px-4">
                      <BookingProgress booking={booking.originalBooking} />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(booking.status)}`}>
                          {booking.status?.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">ID: {booking.bookingId}</span>
                      </div>
                      <span className="text-xl font-bold text-[#0F172A]">${booking.totalPrice}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Recommended Destinations</h2>
              <Link to="/destinations" className="text-[#2563EB] hover:text-blue-700 text-base font-bold flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                View all <MdChevronRight />
              </Link>
            </div>

            {destinationsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                    <LoadingSkeleton className="h-56 w-full" />
                    <div className="p-6">
                      <LoadingSkeleton className="h-6 w-32 mb-3" />
                      <LoadingSkeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : popularDestinations.length === 0 ? (
              <EmptyState
                icon={MdLocationOn}
                title="Discover Amazing Destinations"
                description="Explore our curated collection of breathtaking travel destinations around the world."
                actions={[
                  { label: 'Explore Destinations', to: '/destinations', icon: MdExplore, primary: true },
                ]}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularDestinations.map((destination) => (
                  <motion.div
                    key={destination._id}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={destination.image || 'https://via.placeholder.com/400x300'}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{destination.name}</h3>
                      <p className="text-base font-medium text-gray-600">{destination.country || destination.region}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Quick Actions</h2>
            <div className="grid gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.id}
                    to={action.to}
                    className="flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2563EB] hover:shadow-lg transition-all group"
                  >
                    <div className={`p-4 rounded-xl ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-lg text-gray-700 group-hover:text-[#0F172A]">{action.label}</span>
                    </div>
                    <MdChevronRight className="text-2xl text-gray-400 group-hover:text-[#2563EB]" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Recent Activity</h2>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <MdAccessTime className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                            <Icon className="text-lg" />
                          </div>
                          {index < recentActivity.length - 1 && (
                            <div className="absolute top-10 left-5 w-0.5 h-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="font-semibold text-sm text-[#0F172A] mb-1">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
