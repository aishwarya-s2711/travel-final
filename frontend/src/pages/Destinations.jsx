// src/pages/Destinations.jsx
import { useState, useMemo } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';

// Extract unique categories from data
const CATEGORIES = ['All', ...Array.from(new Set(destinations.map(d => d.category).filter(c => c !== 'Romance')))];

export default function Destinations() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || d.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
  };

  const activeFilters = (search ? 1 : 0) + (category !== 'All' ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <SEO
        title="Curated Travel Destinations | TravelGo"
        description="Browse over 15 handpicked luxury destinations worldwide. Filter by category and plan your bespoke retreat."
        canonical="/destinations"
      />

      <PageHero
        badge="Vacation Spots"
        title="Destinations"
        subtitle="Unveil extraordinary locations mapped for the curious traveler"
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=60"
      />

      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300" aria-label="Destination list">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-12 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm w-full">
            
            {/* Search Input */}
            <div className="premium-input-container flex-1 min-w-[240px] w-full">
              <input
                type="text"
                placeholder=" "
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="premium-input"
                aria-label="Search destinations"
              />
              <FiSearch className="input-icon text-lg" />
              <label className="premium-label">Search locations...</label>
              {search && (
                <button 
                  onClick={() => setSearch('')} 
                  aria-label="Clear search" 
                  className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Desktop Category Filters list */}
            <nav className="hidden lg:block">
              <ul className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        category === cat 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10' 
                          : 'bg-white border-slate-200 text-slate-705 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 h-14 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 w-full cursor-pointer text-xs font-bold uppercase tracking-wider"
            >
              <FiFilter size={14} /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
          </div>

          {/* Destination Cards list */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-1.5 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>No destinations match</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Try adjusting your filters or search keywords.</p>
              <button onClick={clearFilters} className="btn-premium h-11 px-6 text-[10px] font-bold uppercase tracking-wider">Reset Search Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 p-6 overflow-y-auto shadow-2xl border-r border-slate-200/50 dark:border-slate-800">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Filters</h3>
              <button 
                onClick={() => setMobileFilters(false)} 
                aria-label="Close filters" 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>
            {/* Category tabs */}
            <ul className="space-y-2 mb-6">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                      category === cat 
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10' 
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={clearFilters} className="btn-premium w-full mt-6 text-xs font-bold uppercase tracking-wider">Clear All Filters</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
