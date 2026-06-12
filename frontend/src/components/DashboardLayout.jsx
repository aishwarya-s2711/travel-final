import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiSearch, FiUser, FiLogOut, FiSun, FiMoon, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function DashboardLayout({ children, sidebarLinks }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('tg_theme') === 'dark' || document.documentElement.classList.contains('dark');
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('tg_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tg_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tg_theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${searchQuery.toLowerCase()}`);
    }
  };

  const activeLink = sidebarLinks.find(link => 
    link.path === '/admin/dashboard' || link.path === '/dashboard'
      ? location.pathname === link.path
      : location.pathname === link.path || location.pathname.startsWith(link.path + '/')
  );
  const pageTitle = activeLink ? activeLink.label : 'Dashboard';

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] dark:text-slate-100 font-sans">
      
      {/* 1. Persistent Sidebar - Desktop Only (Minimalist Pure White Design) */}
      <aside 
        className={`hidden lg:flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-[#E2E8F0] dark:border-slate-800 transition-all duration-300 shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#E2E8F0] dark:border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2563EB] shadow-sm shrink-0">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white">
                <path d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-base text-[#0F172A] dark:text-white tracking-tight">TravelGo</span>
            )}
          </Link>
          
          {!isCollapsed && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FiChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const active = link.path === '/admin/dashboard' || link.path === '/dashboard'
              ? location.pathname === link.path
              : location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.path}
                to={link.path}
                title={isCollapsed ? link.label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active 
                    ? 'bg-blue-50/70 text-[#2563EB] dark:bg-slate-800 font-semibold border-l-4 border-[#2563EB] rounded-l-none' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <link.icon size={18} className={`shrink-0 ${active ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col gap-2 shrink-0">
          {isCollapsed ? (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="flex justify-center p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FiChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-semibold text-slate-500 hover:text-red-650 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all"
            >
              <FiLogOut size={18} className="shrink-0 text-slate-400" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 205 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 z-50 p-6 flex flex-col lg:hidden border-r border-[#E2E8F0] dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2563EB] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-base text-[#0F172A] dark:text-white">TravelGo</span>
                </Link>
                <button 
                  onClick={() => setMobileSidebarOpen(false)} 
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <FiX size={18} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {sidebarLinks.map((link) => {
                  const active = link.path === '/admin/dashboard' || link.path === '/dashboard'
                    ? location.pathname === link.path
                    : location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active 
                          ? 'bg-blue-50 text-[#2563EB] dark:bg-slate-800' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <link.icon size={18} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <FiLogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar Header */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
          
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <FiMenu size={24} />
            </button>

            {/* Search destinations bar */}
            <form onSubmit={handleSearchSubmit} className="relative group hidden md:block w-72">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/30 transition-all font-medium text-slate-700 dark:text-slate-200"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-all" title="Go to home page">
              <FiHome size={18} />
            </Link>
            
            <button onClick={toggleDarkMode} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-all">
              {darkMode ? <FiSun size={18} className="text-amber-500" /> : <FiMoon size={18} />}
            </button>

            <button className="relative p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-all">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#2563EB] rounded-full border border-white"></span>
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 border-l border-[#E2E8F0] dark:border-slate-750 pl-4 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-[#0F172A] dark:text-white leading-none">{user?.name || 'User'}</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{user?.role || 'Guest'}</p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold bg-[#2563EB]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Core Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC] dark:bg-slate-900/40">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-6xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
