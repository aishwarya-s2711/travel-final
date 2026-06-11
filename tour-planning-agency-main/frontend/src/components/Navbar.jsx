import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FiUser, FiLogOut, FiSettings, FiChevronDown, FiCalendar, FiPhone, FiLogIn } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

const links = [
  { label: 'Home',         path: '/' },
  { label: 'Packages',     path: '/packages' },
  { label: 'Destinations', path: '/destinations' },
  { label: 'Track Trip',   path: '/track' },
  { label: 'Blog',         path: '/blog' },
  { label: 'About',        path: '/about' },
  { label: 'Contact',      path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const { user, logout, isAdmin, isAgent } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const isHome    = location.pathname === '/';

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setMobileOpen(false);
    setDropOpen(false);
    setPrevPath(location.pathname);
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const solid = scrolled || !isHome;

  const dashboardLink = () => {
    if (isAdmin) return '/superadmin/dashboard';
    if (isAgent) return '/agency/dashboard';
    return '/dashboard';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={solid ? {
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(232,228,220,0.80)',
        boxShadow: '0 2px 20px rgba(10,25,47,0.08)',
      } : {
        background: 'rgba(10,25,47,0.30)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Top bar — phone number */}
      {solid && (
        <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(124,58,237,0.20)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-end gap-4 py-1.5">
            <a href="tel:+911234567890" className="flex items-center gap-1.5 text-white/70 hover:text-[#2563EB] transition-colors text-xs font-medium">
              <FiPhone size={11} style={{ color: '#7C3AED' }} />
              Need Help? +1 (888) 123-4567
            </a>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="flex items-center justify-between h-20 lg:h-28 gap-2">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="TravelGo Home">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`text-2xl font-black tracking-tight transition-colors ${solid ? 'text-[#0f172a]' : 'text-white'}`}
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>
                TravelGo
              </span>
            </div>
          </Link>

          {/* Desktop Links - Center (shrinks to make room for button) */}
          <ul className="hidden lg:flex items-center gap-12 justify-center px-8 flex-1">
            {links.map(link => {
              const active = location.pathname === link.path;
              return (
                <motion.li key={link.path} whileHover={{ y: -2 }}>
                  <Link
                    to={link.path}
                    className={`group relative px-1 py-2 text-[16px] font-semibold transition-all duration-300 block ${ 
                      active
                        ? solid ? 'text-[#7C3AED]' : 'text-[#2563EB]'
                        : solid ? 'text-[#475569] hover:text-[#0f172a]' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <motion.span 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: active ? 1 : 0 }}
                      whileHover={{ scaleX: !active ? 1 : 1 }}
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full origin-left transition-all duration-300 ${
                        active ? 'w-6 bg-[#7C3AED]' : 'w-6 bg-[#7C3AED] opacity-50 group-hover:opacity-100'
                      }`} 
                    />
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Auth / Actions - Far Right with Maximum Spacing */}
          <div className="flex items-center justify-end shrink-0">
            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                {/* Notification Bell */}
                {!isAdmin && !isAgent && <NotificationBell />}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropOpen(!dropOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full transition-all ${
                      solid ? 'hover:bg-black/6' : 'hover:bg-white/12'
                    }`}
                    style={solid
                      ? { border: '1.5px solid #e8e4dc' }
                      : { border: '1.5px solid rgba(255,255,255,0.30)' }
                    }
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                      style={{ background: 'linear-gradient(135deg, #0f172a, #7C3AED)' }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span className={`text-sm font-semibold ${solid ? 'text-[#0f172a]' : 'text-white'}`}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <FiChevronDown
                        className={`${solid ? 'text-[#374151]' : 'text-white'}`}
                        size={14}
                      />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden z-50 py-2"
                        style={{ background: '#fff', boxShadow: '0 16px 48px rgba(10,25,47,0.14)', border: '1px solid #f0ede6' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0ede6' }}>
                          <p className="font-semibold text-sm truncate" style={{ color: '#0f172a' }}>{user.name}</p>
                          <p className="text-xs truncate mt-0.5" style={{ color: '#6b7280' }}>{user.email}</p>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider"
                            style={{ background: 'rgba(124,58,237,0.12)', color: '#7C3AED' }}>
                            {user.role || 'User'}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link to={dashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#fafaf8]" style={{ color: '#374151' }}>
                            <FiSettings size={14} style={{ color: '#7C3AED' }} /> Dashboard
                          </Link>
                          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#fafaf8]" style={{ color: '#374151' }}>
                            <FiUser size={14} style={{ color: '#7C3AED' }} /> Profile
                          </Link>
                          {!isAdmin && !isAgent && (
                            <Link to="/dashboard/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#fafaf8]" style={{ color: '#374151' }}>
                              <FiCalendar size={14} style={{ color: '#7C3AED' }} /> My Bookings
                            </Link>
                          )}
                        </div>
                        <div style={{ borderTop: '1px solid #f0ede6' }}>
                          <button
                            onClick={() => { logout(); setDropOpen(false); navigate('/'); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-colors hover:bg-red-50"
                            style={{ color: '#ef4444' }}>
                            <FiLogOut size={14} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              null
            )}

            {/* PREMIUM SIGN IN BUTTON - FAR RIGHT & LARGER */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden lg:block ml-auto"
              >
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-6 lg:px-8 xl:px-10 py-3 lg:py-4 xl:py-5 rounded-lg lg:rounded-xl xl:rounded-2xl text-base lg:text-lg xl:text-xl font-bold tracking-wide transition-all overflow-hidden whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                    color: '#0f172a',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.40)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #c9a86a 0%, #8b5cf6 100%)' }}
                  />
                  <motion.span 
                    className="relative z-10 flex items-center gap-2 lg:gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogIn size={20} className="lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-bold">Sign In</span>
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 rounded-lg lg:rounded-xl xl:rounded-2xl"
                    style={{ 
                      boxShadow: '0 0 0 0 rgba(124,58,237,0.5)',
                    }}
                    whileHover={{
                      boxShadow: '0 0 0 12px rgba(124,58,237,0)',
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ml-2 ${solid ? 'text-[#0f172a] hover:bg-black/6' : 'text-white hover:bg-white/12'}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiX size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiMenuAlt3 size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
            style={{ background: '#fff', borderTop: '1px solid #f0ede6', boxShadow: '0 8px 32px rgba(10,25,47,0.12)' }}
          >
            <div className="px-6 py-6 space-y-2">
              {/* Mobile Menu Links */}
              {links.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={link.path}
                    className={`flex items-center px-4 py-3.5 text-base font-semibold rounded-xl transition-all ${ 
                      location.pathname === link.path
                        ? 'text-[#7C3AED] bg-[rgba(124,58,237,0.12)]'
                        : 'text-[#374151] hover:text-[#0f172a] hover:bg-[#fafaf8]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Divider */}
              <div className="my-4" style={{ borderTop: '1px solid #f0ede6' }} />

              {/* Mobile Auth Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05 }}
              >
                {user ? (
                  <div className="space-y-2">
                    <Link to={dashboardLink()} className="flex items-center px-4 py-3.5 text-base font-semibold rounded-xl bg-[#fafaf8] text-[#0f172a] transition-all hover:bg-[#ede9e0]">
                      <FiSettings size={16} className="mr-2" style={{ color: '#7C3AED' }} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                      className="w-full flex items-center justify-center px-4 py-3.5 text-base font-semibold rounded-xl transition-all"
                      style={{ color: '#ef4444', border: '1.5px solid #fee2e2', background: '#fff9f9' }}
                    >
                      <FiLogOut size={16} className="mr-2" /> Log out
                    </button>
                  </div>
                ) : (
                  <Link to="/login"
                    className="block w-full py-4 text-center text-base font-bold rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#0f172a' }}
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
