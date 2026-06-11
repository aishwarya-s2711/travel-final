import React, { useEffect, useState } from 'react';
import {
  MdDashboard, MdBook, MdPerson, MdFavorite, MdNotifications, MdPayment,
  MdHistory, MdHelp, MdSettings, MdPlace, MdLogout, MdMenu, MdClose, MdHome
} from 'react-icons/md';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';
import NotificationBell from '../components/NotificationBell';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isExpanded = sidebarOpen || isHovered;
  // Check authentication on mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const sidebarItems = [
    { id: 1, label: 'Dashboard', icon: MdDashboard, to: '/dashboard' },
    { id: 2, label: 'My Bookings', icon: MdBook, to: '/dashboard/bookings' },
    { id: 3, label: 'My Profile', icon: MdPerson, to: '/dashboard/profile' },
    { id: 4, label: 'Wishlist', icon: MdFavorite, to: '/dashboard/wishlist' },
    { id: 5, label: 'Notifications', icon: MdNotifications, to: '/dashboard/notifications' },
    { id: 6, label: 'Payments', icon: MdPayment, to: '/dashboard/payments' },
    { id: 7, label: 'Travel History', icon: MdHistory, to: '/dashboard/history' },
    { id: 8, label: 'Support', icon: MdHelp, to: '/dashboard/support' },
    { id: 9, label: 'Settings', icon: MdSettings, to: '/dashboard/settings' },
  ];

  // If not logged in, show nothing (will redirect)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 overflow-y-auto shadow-sm z-50 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isHovered ? 'lg:w-64' : 'lg:w-20'}`}
      >
        <div className="p-6 border-b border-gray-100 shrink-0 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] flex items-center justify-center shrink-0">
              <MdPlace className="text-white text-2xl" />
            </div>
            <span className={`font-bold text-lg text-[#0F172A] whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>
              TravelGo
            </span>
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-800" 
            onClick={() => setSidebarOpen(false)}
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            // Check if current route matches (exact for /dashboard, startsWith for others)
            const isActive = item.to === '/dashboard' 
              ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
              : location.pathname.startsWith(item.to);
              
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${!isExpanded ? 'lg:justify-center lg:px-0' : ''}`}
                title={!isExpanded ? item.label : ""}
              >
                <Icon className={`text-xl shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm text-red-600 ${
              isExpanded ? 'px-4 py-3' : 'py-3 lg:justify-center'
            }`}
            title={!isExpanded ? "Logout" : ""}
          >
            <MdLogout className="text-xl shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Navigation */}
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <MdMenu className="text-2xl" />
              </button>
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-gray-700 hover:text-[#2563EB] transition">Home</Link>
                <Link to="/packages" className="text-sm font-medium text-gray-700 hover:text-[#2563EB] transition">Packages</Link>
                <Link to="/destinations" className="text-sm font-medium text-gray-700 hover:text-[#2563EB] transition">Destinations</Link>
                <Link to="/track-trip" className="text-sm font-medium text-gray-700 hover:text-[#2563EB] transition">Track Trip</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                title="Back to Home"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <MdHome className="text-gray-600 hover:text-[#2563EB] text-[22px] transition-colors" />
              </Link>
              <NotificationBell />
              <UserProfileDropdown />
            </div>
          </div>
        </nav>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
