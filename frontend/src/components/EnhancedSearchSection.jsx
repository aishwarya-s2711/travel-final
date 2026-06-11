import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiClock, FiUsers, FiDollarSign, FiHome, FiSearch } from 'react-icons/fi';

const DESTINATIONS = [
  'Maldives', 'Bali', 'Santorini', 'Switzerland', 'Dubai', 'Paris', 
  'Singapore', 'Thailand', 'New York', 'London', 'Tokyo', 'Sydney'
];

const DURATIONS = [
  '1-3 Days', '4-7 Days', '8-15 Days', '15+ Days'
];

const BUDGETS = [
  'Under $1,000', '$1,000-$2,000', '$2,000-$3,000', '$3,000-$5,000', '$5,000+'
];

const ACCOMMODATIONS = [
  'Luxury', 'Premium', 'Standard', 'Budget'
];

export default function EnhancedSearchSection() {
  const navigate = useNavigate();
  
  const [searchData, setSearchData] = useState({
    destination: '',
    travelDate: '',
    duration: '',
    adults: 2,
    children: 0,
    budget: '',
    accommodation: ''
  });

  const [showDestinations, setShowDestinations] = useState(false);
  const [apiDestinations, setApiDestinations] = useState([]);

  useEffect(() => {
    api.get('/packages/destinations')
      .then(res => setApiDestinations(res.data.destinations || []))
      .catch(err => console.error('Failed to fetch destinations', err));
  }, []);

  const filteredDestinations = (apiDestinations.length > 0 ? apiDestinations : DESTINATIONS).filter(dest =>
    dest.toLowerCase().includes(searchData.destination.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.destination) params.append('search', searchData.destination);
    if (searchData.budget) params.append('budget', searchData.budget);
    if (searchData.accommodation) params.append('accommodation', searchData.accommodation);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative py-12 md:py-16" style={{ background: '#fafaf8' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Container */}
          <div 
            className="bg-white rounded-2xl p-6 md:p-8"
            style={{
              boxShadow: '0 20px 60px rgba(10, 25, 47, 0.12)',
              border: '1px solid rgba(184, 151, 90, 0.1)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                Find Your Perfect <span style={{ color: '#7C3AED' }}>Getaway</span>
              </h2>
              <p className="text-sm md:text-base" style={{ color: '#6b7280' }}>
                Search from 150+ premium destinations worldwide
              </p>
            </div>

            {/* Search Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Destination */}
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  📍 Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    value={searchData.destination}
                    onChange={(e) => {
                      setSearchData({ ...searchData, destination: e.target.value });
                      setShowDestinations(true);
                    }}
                    onFocus={() => setShowDestinations(true)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
                    style={{ background: '#fafaf8' }}
                  />
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED]" size={18} />
                  
                  {/* Destination Dropdown */}
                  {showDestinations && searchData.destination && filteredDestinations.length > 0 && (
                    <div 
                      className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-auto"
                      onMouseLeave={() => setShowDestinations(false)}
                    >
                      {filteredDestinations.map((dest, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchData({ ...searchData, destination: dest });
                            setShowDestinations(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-[#fafaf8] transition-colors border-b border-gray-50 last:border-0"
                          style={{ color: '#374151' }}
                        >
                          <FiMapPin className="inline mr-2 text-[#7C3AED]" size={14} />
                          {dest}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  📅 Travel Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={searchData.travelDate}
                    onChange={(e) => setSearchData({ ...searchData, travelDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm"
                    style={{ background: '#fafaf8' }}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  🌙 Duration
                </label>
                <div className="relative">
                  <select
                    value={searchData.duration}
                    onChange={(e) => setSearchData({ ...searchData, duration: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ background: '#fafaf8', color: '#374151' }}
                  >
                    <option value="">Select Duration</option>
                    {DURATIONS.map(dur => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                  <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  👥 Travelers
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={searchData.adults}
                      onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
                      className="w-full pl-9 pr-2 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                      style={{ background: '#fafaf8' }}
                    >
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={16} />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={searchData.children}
                      onChange={(e) => setSearchData({ ...searchData, children: parseInt(e.target.value) })}
                      className="w-full pl-9 pr-2 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                      style={{ background: '#fafaf8' }}
                    >
                      {[0,1,2,3,4].map(n => (
                        <option key={n} value={n}>{n} Child{n !== 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Budget */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  💰 Budget
                </label>
                <div className="relative">
                  <select
                    value={searchData.budget}
                    onChange={(e) => setSearchData({ ...searchData, budget: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ background: '#fafaf8' }}
                  >
                    <option value="">Select Budget</option>
                    {BUDGETS.map(budget => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                  <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#0f172a' }}>
                  🏨 Accommodation
                </label>
                <div className="relative">
                  <select
                    value={searchData.accommodation}
                    onChange={(e) => setSearchData({ ...searchData, accommodation: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-sm appearance-none cursor-pointer"
                    style={{ background: '#fafaf8' }}
                  >
                    <option value="">Select Type</option>
                    {ACCOMMODATIONS.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
                  <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" size={18} />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                    color: '#0f172a'
                  }}
                >
                  <FiSearch size={18} />
                  Search Packages
                </motion.button>
              </div>
            </div>

            {/* Quick Stats Below Search */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                    150+ Destinations Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                    Instant Booking Confirmation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7C3AED]"></div>
                  <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                    Best Price Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
