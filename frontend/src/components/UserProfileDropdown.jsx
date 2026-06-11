import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdPerson, MdBook, MdFavorite, MdSettings,
  MdLogout, MdVerifiedUser, MdKeyboardArrowDown, MdHome
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingCount, setBookingCount] = useState(0);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const profileResponse = await api.get('/auth/profile');
        setUserData(profileResponse.data.user);

        try {
          const bookingsResponse = await api.get('/bookings/my-bookings');
          setBookingCount(bookingsResponse.data.bookings?.length || 0);
        } catch (err) {
          console.error('Error fetching bookings:', err);
          setBookingCount(0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(user);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: MdDashboard, to: '/dashboard', badge: null },
    { id: 2, label: 'My Profile', icon: MdPerson, to: '/dashboard/profile', badge: null },
    { id: 3, label: 'My Bookings', icon: MdBook, to: '/dashboard/bookings', badge: bookingCount > 0 ? bookingCount : null },
    { id: 4, label: 'Wishlist', icon: MdFavorite, to: '/dashboard/wishlist', badge: null },
    { id: 5, label: 'Settings', icon: MdSettings, to: '/dashboard/settings', badge: null },
    { id: 6, label: 'Back to Home', icon: MdHome, to: '/', badge: null }
  ];

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.06, duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    })
  };

  const getUserInitials = () => {
    const name = userData?.name || user?.name || 'User';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProfileImage = () => {
    return userData?.profileImage || userData?.avatar || user?.profileImage || null;
  };

  const displayName = userData?.name || user?.name || 'User';
  const displayEmail = userData?.email || user?.email || '';
  const isVerified = userData?.isVerified || user?.isVerified || false;

  return (
    <div className="relative" ref={dropdownRef} style={{ overflow: 'visible' }}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
      >
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : getProfileImage() ? (
            <img
              src={getProfileImage()}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {getUserInitials()}
            </div>
          )}

          <div className="hidden md:block text-left">
            {loading ? (
              <>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#0F172A] leading-tight">{displayName}</p>
                <p className="text-xs text-gray-500 leading-tight">{displayEmail}</p>
              </>
            )}
          </div>
        </div>

        <MdKeyboardArrowDown
          size={16}
          className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown Menu - EXACT SPECIFICATIONS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute right-0 bg-white border border-gray-200"
            style={{
              /* EXACT DIMENSIONS AS REQUESTED */
              width: '320px',
              minHeight: '250px',
              borderRadius: '20px',
              padding: '20px',
              marginTop: '12px',
              zIndex: 9999,
              overflow: 'visible',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            {/* Header Section with Profile Info */}
            <div style={{ marginBottom: '20px' }}>
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2.5"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt={displayName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {getUserInitials()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-base text-[#0F172A] truncate">{displayName}</h3>
                      {isVerified && (
                        <MdVerifiedUser className="text-[#2563EB] text-lg flex-shrink-0" title="Verified User" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-2">{displayEmail}</p>
                    {bookingCount > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-[#2563EB] text-xs font-semibold rounded-lg">
                        <MdBook className="text-sm" />
                        {bookingCount} {bookingCount === 1 ? 'Booking' : 'Bookings'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Divider with proper spacing */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#E5E7EB', 
              marginBottom: '16px' 
            }}></div>

            {/* Menu Items with proper spacing */}
            <div style={{ marginBottom: '16px' }}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-xl hover:bg-[#F8FAFC] transition-all group"
                      style={{ 
                        padding: '12px 16px',
                        marginBottom: '6px'
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-white flex items-center justify-center text-gray-600 group-hover:text-[#2563EB] transition-all shadow-sm">
                          <Icon className="text-xl" />
                        </div>
                        <span className="font-semibold text-sm text-gray-700 group-hover:text-[#0F172A] transition-colors">
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="px-2.5 py-1 bg-[#2563EB] text-white text-xs font-bold rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Divider before Logout */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#E5E7EB', 
              marginBottom: '12px' 
            }}></div>

            {/* Logout Button */}
            <motion.div
              custom={menuItems.length}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 rounded-xl hover:bg-red-50 transition-all group"
                style={{ padding: '12px 16px' }}
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-red-100 flex items-center justify-center text-gray-600 group-hover:text-[#EF4444] transition-all shadow-sm">
                  <MdLogout className="text-xl" />
                </div>
                <span className="font-semibold text-sm text-gray-700 group-hover:text-[#EF4444] transition-colors">
                  Logout
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;
