import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiSearch, FiUser, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';

export default function DashboardLayout({ children, sidebarLinks }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  // Extract page title from route
  const activeLink = sidebarLinks.find(link => location.pathname === link.path || location.pathname.startsWith(link.path + '/'));
  const pageTitle = activeLink ? activeLink.label : 'Dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Header */}
      <header className="h-20 bg-[#0f172a] text-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-transform shadow-md group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
              <path d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-black tracking-tight text-2xl text-white hidden sm:block" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>TravelGo</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 mr-4">
            <button onClick={toggleDarkMode} className="p-2.5 text-slate-300 hover:bg-white/10 hover:text-white rounded-full transition-colors">
              {darkMode ? <FiSun size={20} className="text-amber-400" /> : <FiMoon size={20} />}
            </button>
            <button className="relative p-2.5 text-slate-300 hover:bg-white/10 hover:text-white rounded-full transition-colors group">
              <FiBell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a] shadow-sm"></span>
            </button>
            
            {/* Profile Info */}
            <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white leading-none">{user?.name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{user?.role || 'User'}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-inner" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7C3AED)' }}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </header>

      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-30"
              style={{ top: '80px' }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 md:right-6 top-24 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-3 z-40 w-64 overflow-hidden"
            >
              <div className="px-4 pb-3 mb-2 border-b border-slate-100 dark:border-slate-700 md:hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name || 'Administrator'}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{user?.email || 'admin@travelgo.com'}</p>
              </div>

              <div className="px-2">
                <p className="px-3 text-[10px] font-black tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase mb-2 mt-1">Menu</p>
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const active = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          active 
                            ? 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#7C3AED]/20 dark:text-[#a78bfa]' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <link.icon size={18} className={`${active ? 'text-[#7C3AED] dark:text-[#a78bfa]' : 'text-slate-400 dark:text-slate-500'}`} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="px-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                >
                  <FiLogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Page Title Header (Desktop Only) */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between hidden md:flex sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{pageTitle}</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-0.5">
              <span>Home</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-[#7C3AED] dark:text-[#a78bfa]">{pageTitle}</span>
            </div>
          </div>
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-700 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-[#7C3AED]/30 focus:ring-4 focus:ring-[#7C3AED]/10 transition-all w-64 placeholder:text-slate-400 dark:text-white font-medium"
            />
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-7xl"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
