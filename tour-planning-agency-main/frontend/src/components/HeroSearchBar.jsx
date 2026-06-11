import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import api from '../utils/api';

const DESTINATIONS = [
  { name: 'Maldives', country: 'Indian Ocean', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=85', tours: 8, rating: 4.8, reviews: '1200+' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85', tours: 15, rating: 4.7, reviews: '990+' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=85', tours: 12, rating: 4.8, reviews: '1100+' },
  { name: 'Switzerland', country: 'Europe', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', tours: 9, rating: 4.7, reviews: '850+' },
  { name: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=85', tours: 11, rating: 4.7, reviews: '790+' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=85', tours: 10, rating: 4.6, reviews: '880+' },
  { name: 'Singapore', country: 'Asia', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=85', tours: 7, rating: 4.6, reviews: '660+' },
  { name: 'Thailand', country: 'Southeast Asia', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85', tours: 13, rating: 4.5, reviews: '860+' },
];

export default function HeroSearchBar({ onDestinationSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiDestinations, setApiDestinations] = useState([]);

  useEffect(() => {
    api.get('/packages/destinations')
      .then(res => setApiDestinations(res.data || []))
      .catch(err => console.error('Failed to fetch destinations', err));
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const source = apiDestinations.length > 0 ? apiDestinations : DESTINATIONS;
    return source.filter(dest =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.country && dest.country.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, apiDestinations]);

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleSelectDestination = (dest) => {
    setSearchQuery('');
    if (onDestinationSelect) {
      onDestinationSelect(dest);
    }
  };

  return (
    <div className="w-full max-w-[600px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative"
      >
        <div
          className="flex items-center gap-4 px-6 py-4 rounded-[18px] bg-white transition-all duration-300 group"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          }}
        >
          <FiSearch size={20} style={{ color: '#7C3AED', flexShrink: 0 }} />
          
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
            style={{ fontFamily: 'inherit' }}
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <FiX size={18} style={{ color: '#6b7280' }} />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl overflow-hidden z-50"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
          >
            {filteredDestinations.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {filteredDestinations.map((dest, i) => (
                  <motion.button
                    key={dest.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelectDestination(dest)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                  >
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{dest.name}</p>
                      <p className="text-xs text-gray-500">{dest.country}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-700">{dest.tours || dest.packages} tours</p>
                      {dest.rating && <p className="text-xs text-gray-500">★ {dest.rating}</p>}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No destinations found.</p>
                <p className="text-gray-400 text-xs mt-1">Try searching for Maldives, Bali, Paris, Switzerland, or Dubai</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
