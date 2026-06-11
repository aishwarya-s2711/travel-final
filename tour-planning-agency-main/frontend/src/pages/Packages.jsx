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
  { label: 'Any Budget',    min: '',    max: '' },
  { label: 'Under $1,000', min: '0',    max: '999' },
  { label: '$1,000–$2,000',min: '1000', max: '1999' },
  { label: '$2,000–$3,000',min: '2000', max: '2999' },
  { label: '$3,000+',      min: '3000', max: '' },
];
const PER_PAGE = 6;

/* FilterPanel lifted outside Packages so it is never re-created during render */
function FilterPanel({ type, setType, budget, setBudget, activeFilters, clearFilters }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#0f172a' }}>
          <FiFilter size={14} style={{ color: '#7C3AED' }} />Filters
        </h3>
        {activeFilters > 0 && (
          <button onClick={clearFilters} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#7C3AED' }}>
            <FiX size={12} />Clear ({activeFilters})
          </button>
        )}
      </div>

      <div className="mb-6">
        <p className="text-[0.8125rem] font-bold uppercase tracking-widest mb-3" style={{ color: '#4b5563' }}>Tour Type</p>
        <div className="space-y-2">
          {TYPES.map(t => (
            <label key={t} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="type" checked={type === t} onChange={() => setType(t)}
                style={{ accentColor: '#7C3AED' }} />
              <span className="text-sm" style={{ color: type === t ? '#0f172a' : '#4b5563', fontWeight: type === t ? 600 : 400 }}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[0.8125rem] font-bold uppercase tracking-widest mb-3" style={{ color: '#4b5563' }}>Budget</p>
        <div className="space-y-2">
          {BUDGETS.map((b, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="budget" checked={budget === i} onChange={() => setBudget(i)}
                style={{ accentColor: '#7C3AED' }} />
              <span className="text-sm" style={{ color: budget === i ? '#0f172a' : '#4b5563', fontWeight: budget === i ? 600 : 400 }}>
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
        if (type !== 'All') params.append('category', type);
        
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
    <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
      <SEO
        title="Luxury Tour Packages"
        description={`Browse luxury tour packages. Filter by type, budget, and destination. International, honeymoon, family and adventure packages.`}
        canonical="/packages"
      />

      <PageHero
        badge="Explore"
        title="Tour Packages"
        subtitle={`Carefully curated packages for every type of traveler`}
        image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=60"
      />

      <section className="py-12" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-64 shrink-0" aria-label="Package filters">
              <div className="sticky top-28 rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
                <FilterPanel
                  type={type} setType={handleFilterChange(setType)}
                  budget={budget} setBudget={handleFilterChange(setBudget)}
                  activeFilters={activeFilters} clearFilters={clearFilters}
                />
              </div>
            </aside>

            {/* Main */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3"
                style={{ background: '#fff', boxShadow: '0 2px 12px rgba(10,25,47,0.06)' }}>
                <div className="flex items-center gap-2 flex-1 min-w-48 rounded-xl px-4 py-2.5"
                  style={{ border: '1.5px solid #e8e4dc' }}>
                  <FiSearch style={{ color: '#7C3AED' }} />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="flex-1 outline-none text-sm"
                    style={{ fontFamily: 'DM Sans, sans-serif', background: 'transparent', color: '#1a1a1a' }}
                    aria-label="Search packages"
                  />
                  {search && (
                    <button onClick={() => { setSearch(''); setPage(1); }} aria-label="Clear search">
                      <FiX size={14} style={{ color: '#aaa' }} />
                    </button>
                  )}
                </div>

                <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer"
                  style={{ border: '1.5px solid #e8e4dc', fontFamily: 'DM Sans, sans-serif', color: '#1a1a1a', background: '#fff' }}
                  aria-label="Sort packages">
                  <option value="default">Sort: Default</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>

                <div className="flex rounded-xl overflow-hidden" style={{ border: '1.5px solid #e8e4dc' }}>
                  <button onClick={() => setView('grid')} className="p-2.5 transition-all"
                    style={{ background: view === 'grid' ? '#0f172a' : '#fff', color: view === 'grid' ? '#fff' : '#888' }}
                    aria-label="Grid view" aria-pressed={view === 'grid'}>
                    <FiGrid size={15} />
                  </button>
                  <button onClick={() => setView('list')} className="p-2.5 transition-all"
                    style={{ background: view === 'list' ? '#0f172a' : '#fff', color: view === 'list' ? '#fff' : '#888' }}
                    aria-label="List view" aria-pressed={view === 'list'}>
                    <FiList size={15} />
                  </button>
                </div>

                <button onClick={() => setMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                  style={{ border: '1.5px solid #e8e4dc', color: '#0f172a', background: activeFilters > 0 ? 'rgba(124,58,237,0.08)' : '#fff' }}
                  aria-label="Open filters">
                  <FiFilter size={13} /> Filters {activeFilters > 0 && `(${activeFilters})`}
                </button>

                <span className="text-[0.8125rem] font-medium" style={{ color: '#4b5563' }}>
                  {totalItems} package{totalItems !== 1 ? 's' : ''} found
                </span>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
                </div>
              ) : packages.length > 0 ? (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                  {packages.map((pkg, i) => <PackageCard key={pkg._id || pkg.id} pkg={pkg} index={i} />)}
                </div>
              ) : (
                <div className="text-center py-24 rounded-2xl" style={{ background: '#fff' }}>
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                    No packages found
                  </h3>
                  <p className="text-sm mb-6" style={{ color: '#888' }}>Try adjusting your search or filters</p>
                  <button onClick={clearFilters} className="btn-outline">Clear All Filters</button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10" role="navigation" aria-label="Pagination">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-10 h-10 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: page === i + 1 ? '#0f172a' : '#fff',
                        color: page === i + 1 ? '#fff' : '#888',
                        border: `1.5px solid ${page === i + 1 ? '#0f172a' : '#e8e4dc'}`,
                      }}
                      aria-label={`Page ${i + 1}`}
                      aria-current={page === i + 1 ? 'page' : undefined}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="absolute top-0 left-0 bottom-0 w-80 p-6 overflow-y-auto"
            style={{ background: '#fff', maxWidth: '90vw' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>Filters</h3>
              <button onClick={() => setMobileFilters(false)} aria-label="Close filters"
                className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#f8f6f2' }}>
                <FiX size={16} />
              </button>
            </div>
            <FilterPanel
              type={type} setType={handleFilterChange(setType)}
              budget={budget} setBudget={handleFilterChange(setBudget)}
              activeFilters={activeFilters} clearFilters={clearFilters}
            />
            <button onClick={() => setMobileFilters(false)} className="btn-primary w-full justify-center mt-4"
              style={{ width: '100%' }}>
              Show {totalItems} Packages
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
