import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import api from '../utils/api';

const TYPES = ['All', 'International', 'Family', 'Adventure', 'Luxury', 'Wildlife', 'Cultural'];
const BUDGETS = [
  { label: 'Any Budget',       min: '',      max: '' },
  { label: 'Under ₹15,000',    min: '0',     max: '14999' },
  { label: '₹15,000–₹25,000',  min: '15000', max: '24999' },
  { label: '₹25,000–₹40,000',  min: '25000', max: '39999' },
  { label: '₹40,000+',         min: '40000', max: '' },
];
const PER_PAGE = 6;

function FilterPanel({ type, setType, budget, setBudget, activeFilters, clearFilters }) {
  return (
    <div className="space-y-8">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <FiFilter className="text-blue-600" /> Filters
        </h3>
        {activeFilters > 0 && (
          <button 
            onClick={clearFilters} 
            className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/45 px-2.5 py-1.5 rounded-lg cursor-pointer"
          >
            Clear ({activeFilters})
          </button>
        )}
      </div>

      {/* Tour Type */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-4 text-slate-400 dark:text-slate-550">Tour Category</p>
        <div className="space-y-2.5">
          {TYPES.map(t => (
            <label key={t} className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <input 
                type="radio" 
                name="type" 
                checked={type === t} 
                onChange={() => setType(t)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: '#2563EB' }} 
              />
              <span className={type === t ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-4 text-slate-400 dark:text-slate-550">Budget Bracket</p>
        <div className="space-y-2.5">
          {BUDGETS.map((b, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <input 
                type="radio" 
                name="budget" 
                checked={budget === i} 
                onChange={() => setBudget(i)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: '#2563EB' }} 
              />
              <span className={budget === i ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}>
                {b.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Packages() {
  const [searchParams] = useSearchParams();
  const [view, setView]           = useState('grid');
  const [search, setSearch]       = useState(searchParams.get('search') || '');
  const [type, setType]           = useState(searchParams.get('type') || 'All');
  const [budget, setBudget]       = useState(0);
  const [sort, setSort]           = useState('default');
  const [page, setPage]           = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  
  const [packages, setPackages]   = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', PER_PAGE);
        if (search) params.append('search', search);
        if (type !== 'All') params.append('type', type);
        
        const b = BUDGETS[budget];
        if (b.min) params.append('minPrice', b.min);
        if (b.max) params.append('maxPrice', b.max);
        if (sort !== 'default') params.append('sort', sort);

        const res = await api.get(`/packages?${params.toString()}`);
        setPackages(res.data.packages || []);
        setTotalItems(res.data.total || 0);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, [search, type, budget, sort, page]);

  const clearFilters   = () => { setType('All'); setBudget(0); setSearch(''); setSort('default'); setPage(1); };
  const activeFilters  = (type !== 'All' ? 1 : 0) + (budget !== 0 ? 1 : 0) + (search ? 1 : 0);

  const handleFilterChange = (setter) => (val) => { setter(val); setPage(1); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <SEO
        title="Explore Bespoke Tour Packages | TravelGo"
        description="Filter luxury packages by category, budget, and destination. Santorini sunsets, Swiss rail corridors, and private Maldives overwater villas."
        canonical="/packages"
      />

      <PageHero
        badge="Luxury Vacation Plans"
        title="Tour Packages"
        subtitle="Meticulously mapped itineraries for families, couples, and adventurers"
        image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=60"
      />

      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-64 shrink-0" aria-label="Package filters">
              <div className="sticky top-28 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <FilterPanel
                  type={type} setType={handleFilterChange(setType)}
                  budget={budget} setBudget={handleFilterChange(setBudget)}
                  activeFilters={activeFilters} clearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Packages Main Panel */}
            <div className="flex-1 space-y-8">
              
              {/* Upper Toolbar Bar */}
              <div className="rounded-3xl p-4 flex flex-wrap items-center gap-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 shadow-sm">
                
                {/* Search Field */}
                <div className="premium-input-container flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder=" "
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="premium-input"
                    aria-label="Search packages"
                  />
                  <FiSearch className="input-icon text-lg" />
                  <label className="premium-label">Search Destinations...</label>
                  {search && (
                    <button 
                      onClick={() => { setSearch(''); setPage(1); }} 
                      className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Sort Option dropdown */}
                <select 
                  value={sort} 
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="h-14 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  aria-label="Sort packages"
                >
                  <option value="default">Default Sort</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View togglers */}
                <div className="flex h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <button 
                    onClick={() => setView('grid')} 
                    className={`px-4 transition-all cursor-pointer ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'}`}
                    aria-label="Grid view" 
                    aria-pressed={view === 'grid'}
                  >
                    <FiGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setView('list')} 
                    className={`px-4 transition-all cursor-pointer ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'}`}
                    aria-label="List view" 
                    aria-pressed={view === 'list'}
                  >
                    <FiList size={16} />
                  </button>
                </div>

                {/* Mobile Filters trigger */}
                <button 
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden flex items-center justify-center gap-2 h-14 px-5 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
                  aria-label="Open filters"
                >
                  <FiFilter size={14} /> Filters {activeFilters > 0 && `(${activeFilters})`}
                </button>

                <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide ml-auto">
                  {totalItems} Package{totalItems !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Package Results list */}
              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
                </div>
              ) : packages.length > 0 ? (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-8'}>
                  {packages.map((pkg, i) => <PackageCard key={pkg._id || pkg.id} pkg={pkg} index={i} />)}
                </div>
              ) : (
                <div className="text-center py-24 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-1.5 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>No packages matched</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Try refining your search terms or clearing your filter selection.</p>
                  <button onClick={clearFilters} className="btn-premium py-3 px-6 h-auto text-[10px] font-bold uppercase tracking-wider">Reset Search Filters</button>
                </div>
              )}

              {/* Pagination Dots list */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6" role="navigation" aria-label="Pagination">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-10 h-10 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center"
                      style={{
                        background: page === i + 1 ? '#2563EB' : 'transparent',
                        borderColor: page === i + 1 ? '#2563EB' : 'var(--border)',
                        color: page === i + 1 ? '#fff' : 'var(--text-primary)',
                      }}
                      aria-label={`Page ${i + 1}`}
                      aria-current={page === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters slide-in sidebar */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="absolute top-0 left-0 bottom-0 w-80 p-6 overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200/50 dark:border-slate-800"
            style={{ maxWidth: '90vw' }}
          >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Filters</h3>
              <button 
                onClick={() => setMobileFilters(false)} 
                aria-label="Close filters"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>
            
            <FilterPanel
              type={type} setType={handleFilterChange(setType)}
              budget={budget} setBudget={handleFilterChange(setBudget)}
              activeFilters={activeFilters} clearFilters={clearFilters}
            />
            
            <button 
              onClick={() => setMobileFilters(false)} 
              className="btn-premium w-full mt-8 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Show {totalItems} Packages
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
