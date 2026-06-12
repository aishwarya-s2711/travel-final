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
  { label: 'Track Trip',   path: '/track-trip' },
  { label: 'Blog',         path: '/blog' },
  { label: 'About',        path: '/about' },
  { label: 'Contact',      path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [darkMode, setDarkMode]     = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const { user, logout, isAdmin, isAgent } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const isHome    = location.pathname === '/';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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

  const isScrolled = scrolled || !isHome;

  const dashboardLink = () => {
    if (isAdmin) return '/superadmin/dashboard';
    if (isAgent) return '/agency/dashboard';
    return '/dashboard';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg border-b border-slate-100 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      {/* Top Bar Contact Info (Always visible on desktop/tablet for premium feel) */}
      <div className={`absolute top-0 left-0 right-0 py-1.5 px-6 lg:px-12 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 border-b ${
        isScrolled ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-black/30 text-white/90 border-white/10 backdrop-blur-sm'
      }`}>
        <span className="flex items-center gap-1.5"><FiPhone size={10} className={isScrolled ? "text-[#D4A74F]" : "text-[#D4A74F]"} /> Concierge Hotline: +1 (888) 123-4567</span>
        <span className="hidden sm:inline">24/7 Planning & Local Specialist Support</span>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full h-16 mt-7">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="TravelGo Home">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D4A74F] to-[#E5C158] shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M24 6C18.268 6 13 11.268 13 18C13 26 24 38 24 38C24 38 35 26 35 18C35 11.268 29.732 6 24 6Z" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tight leading-none mb-0.5 ${isScrolled ? 'text-[#0B1F3A]' : 'text-white'}`}>
              TravelGo
            </span>
            <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase text-[#D4A74F]">
              Premium travel agency
            </span>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 justify-center flex-1 px-8">
          {links.map(link => {
            const active = location.pathname === link.path;
            return (
              <div key={link.path} className="relative py-2">
                <Link
                  to={link.path}
                  className={`text-[12px] uppercase tracking-[0.1em] font-bold transition-colors duration-200 block ${
                    active 
                      ? 'text-[#D4A74F]' 
                      : isScrolled ? 'text-[#0B1F3A] hover:text-[#D4A74F]' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A74F] rounded-full" 
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* User Logged In Actions */}
          {user ? (
            <div className="flex items-center gap-3">
              {!isAdmin && !isAgent && <NotificationBell />}

              {/* Profile Menu Trigger */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDropOpen(!dropOpen)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all border cursor-pointer ${
                    isScrolled ? 'border-slate-200 hover:bg-slate-50' : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="w-6.5 h-6.5 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-br from-[#D4A74F] to-[#E5C158]">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className={`text-xs font-bold ${isScrolled ? 'text-[#0B1F3A]' : 'text-white'}`}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FiChevronDown className={isScrolled ? 'text-slate-400' : 'text-white/70'} size={12} />
                  </motion.div>
                </motion.button>

                {/* Profile Dropdown Panel - Premium Redesign */}
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden z-50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl"
                      style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}
                    >
                      {/* Accent Glow */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500" />
                      
                      <div className="px-4 py-4 border-b border-slate-800">
                        <p className="font-bold text-sm text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/20">
                          {user.role || 'User'}
                        </span>
                      </div>
                      <div className="py-2">
                        <Link 
                          to={dashboardLink()} 
                          className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-indigo-600/10 hover:text-white transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                            <FiSettings size={14} className="text-blue-400 group-hover:text-white" />
                          </div>
                          Dashboard
                        </Link>
                        <Link 
                          to="/dashboard/profile" 
                          className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-indigo-600/10 hover:text-white transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                            <FiUser size={14} className="text-indigo-400 group-hover:text-white" />
                          </div>
                          Profile
                        </Link>
                        {!isAdmin && !isAgent && (
                          <Link 
                            to="/dashboard/bookings" 
                            className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-indigo-600/10 hover:text-white transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-violet-600 transition-all">
                              <FiCalendar size={14} className="text-violet-400 group-hover:text-white" />
                            </div>
                            My Bookings
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-slate-800 pt-2 mt-1 px-2 pb-2">
                        <button
                          onClick={() => { logout(); setDropOpen(false); navigate('/'); }}
                          className="flex items-center gap-3 px-4 py-2.5 mx-1 w-full rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                            <FiLogOut size={14} className="text-rose-400" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Premium Sign In Call-to-Action */
            <Link
              to="/login"
              className="hidden lg:inline-flex items-center justify-center gap-2 h-11 px-6 text-xs font-bold tracking-widest uppercase rounded-xl transition-all bg-gradient-to-r from-[#D4A74F] to-[#E5C158] hover:shadow-lg text-[#0B1F3A] hover:-translate-y-0.5 shadow-md shadow-[#D4A74F]/20"
            >
              <FiLogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
              isScrolled ? 'text-[#0B1F3A] hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 shadow-lg"
          >
            <div className="px-6 py-6 space-y-2">
              {links.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-slate-100 dark:border-slate-800 my-4 pt-4" />

              {/* Mobile Auth Options */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.04 }}
              >
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to={dashboardLink()}
                      className="flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <FiSettings size={15} className="mr-2.5 text-blue-600" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition-colors"
                    >
                      <FiLogOut size={15} className="mr-2" /> Log out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full py-3.5 text-center text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
