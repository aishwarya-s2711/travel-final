// src/pages/Destinations.jsx
import { useState, useMemo } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/destinations';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';

// Extract unique categories from data (excluding "Romance" if present)
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
    <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
      <SEO
        title="Explore Destinations — TravelGo"
        description="Discover over 15 curated travel destinations across the world. Filter by category, search by name, and start planning your next adventure."
        canonical="/destinations"
      />

      <PageHero
        badge="Explore"
        title="Destinations"
        subtitle="Hand‑picked luxury destinations for every traveler"
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=60"
      />

      <section className="py-12" style={{ background: '#ffffff' }} aria-label="Destination list">
        <div className="max-w-7xl mx-auto px-6">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-8">
            {/* Search */}
            <div className="relative flex-1 min-w-48 rounded-xl border border-gray-200 px-4 py-2.5 flex items-center" style={{ background: '#fff' }}>
              <FiSearch size={14} style={{ color: '#7C3AED' }} />
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={e => { setSearch(e.target.value); }}
                className="flex-1 ml-2 outline-none text-base"
                style={{ fontFamily: 'DM Sans, sans-serif', background: 'transparent', color: '#1a1a1a' }}
                aria-label="Search destinations"
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search" className="text-gray-400 hover:text-gray-600">
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Category Filter (desktop) */}
            <ul className="hidden lg:flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold tracking-wide transition-colors"
                    style={category === cat ? { background: '#0f172a', color: '#fff' } : { background: 'transparent', color: 'var(--text-mid)', border: '1px solid #e8e4dc' }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200"
              style={{ background: '#fff' }}
            >
              <FiFilter size={14} /> Filters {activeFilters > 0 && `(${activeFilters})`}
            </button>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" style={{ background: '#fff' }}>
              <p className="text-2xl font-light" style={{ color: '#0f172a' }}>No destinations match your criteria.</p>
              <button onClick={clearFilters} className="mt-4 btn-outline">Clear Filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Filters</h3>
              <button onClick={() => setMobileFilters(false)} aria-label="Close filters" className="text-gray-600">
                <FiX size={18} />
              </button>
            </div>
            {/* Category list */}
            <ul className="space-y-2 mb-6">
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className="w-full text-left px-4 py-2 rounded font-semibold text-sm transition-all" 
                    style={category === cat ? { background: '#0f172a', color: '#fff' } : { background: '#f5f5f5', color: 'var(--text-dark)' }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={clearFilters} className="btn-primary w-full">Clear All Filters</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
