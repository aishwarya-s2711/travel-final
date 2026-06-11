import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import HeroSearchBar from '../components/HeroSearchBar';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp.default || CountUp);
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiSearch, FiCalendar, FiArrowUpRight, FiMapPin, FiStar, FiPlay, FiAward, FiShield, FiHeadphones, FiPackage, FiCheckCircle, FiX } from 'react-icons/fi';
import { HiArrowLongRight } from 'react-icons/hi2';
import PackageCard from '../components/PackageCard';
import { useEffect } from 'react';
import api from '../utils/api';

/* ── Hero slides ── */
const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=90',
    label: 'MALDIVES',
    title: 'Discover the World\'s\nMost Beautiful\nDestinations',
    sub: 'Luxury travel experiences crafted for unforgettable journeys',
  },
  {
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=90',
    label: 'BALI, INDONESIA',
    title: 'Discover the World\'s\nMost Beautiful\nDestinations',
    sub: 'Luxury travel experiences crafted for unforgettable journeys',
  },
  {
    img: 'https://www.easysim.global/img/85f83345-accc-470b-b829-3545e60c0961/greece-santorini-thumb.webp?fm=webp&q=90&auto=compress%2Cformat&fit=min&crop=800%2C450%2C0%2C83',
    label: 'SANTORINI, GREECE',
    title: 'Discover the World\'s\nMost Beautiful\nDestinations',
    sub: 'Luxury travel experiences crafted for unforgettable journeys',
  },
  {
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=90',
    label: 'SWISS ALPS',
    title: 'Discover the World\'s\nMost Beautiful\nDestinations',
    sub: 'Luxury travel experiences crafted for unforgettable journeys',
  },
];

/* ── Featured destinations ── */
const featDest = [
  { name: 'Maldives',    country: 'Indian Ocean', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=85', tours: 8,  rating: 4.8, reviews: '1200+' },
  { name: 'Bali',        country: 'Indonesia',    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85', tours: 15, rating: 4.7, reviews: '990+' },
  { name: 'Santorini',   country: 'Greece',       img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=85', tours: 12, rating: 4.8, reviews: '1100+' },
  { name: 'Switzerland', country: 'Europe',       img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', tours: 9,  rating: 4.7, reviews: '850+' },
  { name: 'Dubai',       country: 'UAE',          img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=85', tours: 11, rating: 4.7, reviews: '790+' },
  { name: 'Paris',       country: 'France',       img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=85', tours: 10, rating: 4.6, reviews: '880+' },
  { name: 'Singapore',   country: 'Asia',         img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=85', tours: 7,  rating: 4.6, reviews: '660+' },
  { name: 'Thailand',    country: 'Southeast Asia', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=85', tours: 13, rating: 4.5, reviews: '860+' },
];

const WHY_US = [
  { icon: FiAward,      title: '5-Star Hotels',        sub: 'Handpicked luxury accommodations' },
  { icon: FiShield,     title: 'Best Price Guarantee', sub: 'Get the best price or we match it' },
  { icon: FiCheckCircle,title: 'Expert Tour Guides',   sub: 'Professional local guides' },
  { icon: FiHeadphones, title: '24/7 Support',         sub: 'We are here to help anytime' },
  { icon: FiPackage,    title: 'Secure Booking',       sub: '100% secure and safe' },
  { icon: FiCheckCircle,title: 'Personalized Trips',   sub: 'Customized itineraries just for you' },
];

const EXPERIENCES = [
  { label: 'Beach Escapes', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', path: '/destinations?search=maldives' },
  { label: 'Mountain Adventures', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', path: '/destinations?search=switzerland' },
  { label: 'Cultural Tours', img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80', path: '/destinations?search=culture' },
  { label: 'Wildlife Safaris', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80', path: '/destinations?search=wildlife' },
  { label: 'Luxury Cruises', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', path: '/destinations?search=cruises' },
  { label: 'Honeymoon Retreats', img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80', path: '/destinations?search=honeymoon' },
];

const TESTIMONIALS = [
  { name: 'James L.',   loc: 'New York, USA',      img: 'https://randomuser.me/api/portraits/men/32.jpg',   text: 'The trip was beyond amazing! Every detail was perfectly planned.', rating: 5 },
  { name: 'Sophia M.',  loc: 'London, UK',         img: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Best vacation we ever had. Highly recommended TravelGo!', rating: 5 },
  { name: 'Rahul K.',   loc: 'Bangalore, India',   img: 'https://randomuser.me/api/portraits/men/61.jpg',   text: 'Excellent service and support throughout our journey.', rating: 5 },
  { name: 'Emily R.',   loc: 'Sydney, Australia',  img: 'https://randomuser.me/api/portraits/women/23.jpg', text: 'Luxury experience at an affordable price. Will book again!', rating: 5 },
];

function StatItem({ end, suffix, prefix = '', label }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-4xl lg:text-5xl font-light text-white mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
        {inView ? <CountUpComponent start={0} end={end} duration={2.5} separator="," prefix={prefix} suffix={suffix} /> : `${prefix}0${suffix}`}
      </div>
      <p className="text-[0.75rem] tracking-[1.5px] uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</p>
    </div>
  );
}

/* ── Video Modal Component ── */
function VideoModalComponent({ isOpen, onClose, videoUrl }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden bg-black"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/75 rounded-full transition-colors"
          aria-label="Close video"
        >
          <FiX size={24} className="text-white" />
        </button>
        <div style={{ aspectRatio: '16/9' }}>
          <iframe
            src={videoUrl}
            title="TravelGo promotional video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [search, setSearch]     = useState({ destination: '', date: '', budget: 'All', packageType: 'All' });
  const [showVideo, setShowVideo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        const fetched = data.packages || data || [];
        setPackages(fetched);
      } catch (err) {
        console.error('Failed to fetch packages:', err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleExplorePackages = () => {
    const params = new URLSearchParams();
    if (search.destination) params.append('search', search.destination);
    if (search.budget && search.budget !== 'All') params.append('budget', search.budget);
    if (search.packageType && search.packageType !== 'All') params.append('type', search.packageType);
    navigate(`/packages?${params.toString()}`);
  };

  const handlePackageScroll = () => {
    const element = document.getElementById('packages-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/packages');
    }
  };

  const handleSearchDestination = () => {
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${searchQuery.toLowerCase()}`);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <SEO
        title="Luxury Travel & Tour Packages"
        description="Discover 500+ curated luxury tour packages to Santorini, Maldives, Bali, Swiss Alps and 80+ destinations. Book your dream journey with TravelGo today."
        canonical="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'TravelGo — Luxury Travel',
          description: 'Premium luxury travel agency. 500+ curated packages.'
        }}
      />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative h-[550px] md:h-[600px] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={heroSlides.length >= 3}
          className="w-full h-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <img
                  src={slide.img}
                  alt={slide.label}
                  className="w-full h-full object-cover"
                  style={{ animation: 'kenBurns 10s ease-in-out infinite alternate' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,25,47,0.50) 0%, rgba(10,25,47,0.35) 40%, rgba(10,25,47,0.65) 100%)' }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                  <motion.p
                    key={`label-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="overline mb-3"
                    style={{ color: '#2563EB', letterSpacing: '0.20em' }}
                  >
                    {slide.label}
                  </motion.p>
                  <motion.h1
                    key={`title-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="font-light leading-[1.08] mb-4 whitespace-pre-line"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                      textShadow: '0 4px 24px rgba(0,0,0,0.55)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    key={`sub-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm md:text-base mb-8 font-medium"
                    style={{ color: 'rgba(255,255,255,0.90)', letterSpacing: '0.04em', maxWidth: 520 }}
                  >
                    {slide.sub}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    <button 
                      onClick={handlePackageScroll}
                      className="btn-hero"
                    >
                      Explore Packages
                    </button>
                    <button 
                      onClick={() => setShowVideo(true)} 
                      className="btn-ghost flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center hover:bg-white/35 transition-colors">
                        <FiPlay size={12} className="ml-0.5" />
                      </div>
                      Watch Video
                    </button>
                  </motion.div>

                  {/* Hero Search Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-center w-full px-6 md:px-0 mt-8"
                  >
                    <HeroSearchBar onDestinationSelect={() => {}} />
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <VideoModalComponent isOpen={showVideo} onClose={() => setShowVideo(false)} videoUrl="https://www.youtube.com/embed/W4YfDg-dKzk" />

        {/* Floating Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute -bottom-32 md:-bottom-28 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-20"
        >
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
            <div className="flex flex-col md:flex-row gap-0">
              <div className="flex items-center gap-3 flex-1 px-5 py-5 border-b md:border-b-0 md:border-r" style={{ borderColor: '#f0ede6' }}>
                <FiMapPin style={{ color: '#7C3AED', flexShrink: 0 }} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[1.5px] text-[#0f172a] mb-1">Destination</p>
                  <input type="text" placeholder="" value={search.destination} onChange={e => setSearch({ ...search, destination: e.target.value })} className="w-full outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 px-5 py-5 border-b md:border-b-0 md:border-r" style={{ borderColor: '#f0ede6' }}>
                <FiCalendar style={{ color: '#7C3AED', flexShrink: 0 }} size={20} />
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[1.5px] text-[#0f172a] mb-1">Travel Date</p>
                  <input type="date" value={search.date} onChange={e => setSearch({ ...search, date: e.target.value })} className="w-full outline-none text-sm text-gray-900 bg-transparent" />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 px-5 py-5 border-b md:border-b-0 md:border-r" style={{ borderColor: '#f0ede6' }}>
                <FiSearch style={{ color: '#7C3AED', flexShrink: 0 }} size={20} />
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[1.5px] text-[#0f172a] mb-1">Budget</p>
                  <select value={search.budget} onChange={e => setSearch({ ...search, budget: e.target.value })} className="outline-none text-sm text-gray-900 bg-transparent cursor-pointer w-full">
                    <option value="All">Select budget</option>
                    <option value="under1000">Under $1,000</option>
                    <option value="1000-2000">$1,000–$2,000</option>
                    <option value="2000-3000">$2,000–$3,000</option>
                    <option value="above3000">$3,000+</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 px-5 py-5 border-b md:border-b-0 md:border-r" style={{ borderColor: '#f0ede6' }}>
                <FiPackage style={{ color: '#7C3AED', flexShrink: 0 }} size={20} />
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[1.5px] text-[#0f172a] mb-1">Package Type</p>
                  <select value={search.packageType} onChange={e => setSearch({ ...search, packageType: e.target.value })} className="outline-none text-sm text-gray-900 bg-transparent cursor-pointer w-full">
                    <option value="All">Select type</option>
                    <option value="International">International</option>
                    <option value="Domestic">Domestic</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>
              <button onClick={handleExplorePackages} className="flex items-center justify-center gap-2 px-8 py-5 text-xs font-black tracking-[0.14em] uppercase transition-all duration-300 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#0f172a' }} onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #c9a86a, #8b5cf6)'} onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #2563EB)'}>
                <FiSearch size={16} /> Search
              </button>
            </div>
          </div>
        </motion.div>

        <style>{`@keyframes kenBurns { from { transform: scale(1.05); } to { transform: scale(1.12); } }`}</style>
      </section>

      <div className="h-32 md:h-28" />

      {/* ═══════════════════════ FEATURED DESTINATIONS - PREMIUM REDESIGN ═══════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="label-text mb-3">Explore Top Destinations</p>
              <h2 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                Iconic <span style={{ color: '#7C3AED' }}>Destinations</span>
              </h2>
              <p className="text-sm mt-3" style={{ color: '#6b7280' }}>Discover the world's most breathtaking places</p>
            </div>
            <Link to="/destinations"
              className="flex items-center gap-2 text-xs font-black tracking-[0.14em] uppercase transition-all shrink-0 px-6 py-3 rounded-xl border"
              style={{ color: '#0f172a', borderColor: '#e8e4dc' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4dc'; e.currentTarget.style.color = '#0f172a'; }}
            >
              View All <HiArrowLongRight size={18} />
            </Link>
          </div>

          {/* Premium Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {featDest.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl cursor-pointer group h-96 md:h-[440px]"
                style={{
                  boxShadow: '0 12px 40px rgba(10,25,47,0.12)',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 24px 64px rgba(10,25,47,0.20)';
                  e.currentTarget.style.transform = 'translateY(-12px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,25,47,0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Background Image */}
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  loading="lazy"
                />

                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.60) 40%, rgba(10,25,47,0.20) 100%)'
                }} />

                {/* Top Badge */}
                <div className="absolute top-4 md:top-5 left-4 md:left-5">
                  <span className="inline-block px-4 py-2 text-[10px] md:text-[11px] font-black tracking-[0.12em] uppercase rounded-full transition-all duration-300" 
                    style={{
                      background: 'rgba(0,0,0,0.40)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  >
                    Quick View
                  </span>
                </div>

                {/* Content Container - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  {/* Destination Name */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight transition-all duration-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {dest.name}
                  </h3>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <FiStar size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span className="text-sm font-bold text-white">{dest.rating}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>({dest.reviews} Reviews)</span>
                  </div>

                  {/* Location Subtitle */}
                  <p className="text-xs md:text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {dest.country}
                  </p>

                  {/* Explore Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/destinations?search=${dest.name.toLowerCase()}`)}
                    className="w-full py-3 md:py-3.5 text-xs md:text-sm font-black tracking-[0.12em] uppercase rounded-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                      color: '#0f172a',
                      boxShadow: '0 8px 20px rgba(124,58,237,0.25)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #c9a86a, #8b5cf6)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #2563EB)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.25)';
                    }}
                  >
                    Explore
                  </motion.button>
                </div>

                {/* Glassmorphism Border Effect */}
                <div className="absolute inset-0 rounded-3xl" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none'
                }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ WHY TRAVELERS CHOOSE US (STATS) ═══════════════════════ */}
      <section style={{ background: '#0f172a', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-14 md:mb-20">
            <p className="label-text justify-center mb-3">Our Achievements</p>
            <h2 className="text-4xl lg:text-5xl font-light text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Why Travelers <span style={{ color: '#2563EB' }}>Choose Us</span>
            </h2>
            <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.70)' }}>Trusted by thousands of travelers worldwide</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <StatItem end={10000} suffix="+" label="Happy Travelers Creating unforgettable journeys" />
            <StatItem end={150} suffix="+" label="Premium Destinations Handpicked luxury" />
            <StatItem end={15} suffix="+" label="Years of Excellence Trusted expertise" />
            <StatItem end={24} suffix="/7" label="Customer Support Always available" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SEARCH DESTINATION SECTION ═══════════════════════ */}
      <section style={{ background: '#ffffff', paddingTop: 'clamp(2.5rem, 10vw, 3.75rem)', paddingBottom: 'clamp(2.5rem, 10vw, 3.75rem)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
              Search <span style={{ color: '#7C3AED' }}>Destination</span>
            </h2>
            <p className="text-sm mt-3" style={{ color: '#6b7280' }}>Discover your next adventure</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mx-auto max-w-2xl"
          >
            <div className="w-full flex items-center gap-0" style={{ background: '#ffffff' }}>
              <div
                className="flex-1 flex items-center gap-3 px-5 py-4 rounded-l-2xl transition-all duration-300"
                style={{
                  background: '#ffffff',
                  border: '2px solid #e8e4dc',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#7C3AED';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e8e4dc';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                }}
              >
                <FiSearch size={20} style={{ color: '#7C3AED', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearchDestination()}
                  className="flex-1 outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
                />
              </div>
              
              <button
                onClick={handleSearchDestination}
                className="px-7 md:px-10 py-4 text-xs font-black tracking-[0.14em] uppercase rounded-r-2xl transition-all duration-300 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
                  color: '#0f172a',
                  border: '2px solid #7C3AED',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #c9a86a, #8b5cf6)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #2563EB)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                }}
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ WHY CHOOSE US ═══════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="label-text justify-center mb-3">Our Promise</p>
            <h2 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
              Why Choose <span style={{ color: '#7C3AED' }}>TravelGo?</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {WHY_US.map(({ icon: Icon, title, sub }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 group cursor-default"
                style={{ background: '#fafaf8', border: '1px solid #f0ede6' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,25,47,0.10)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#f0ede6'; }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <Icon size={22} style={{ color: '#7C3AED' }} />
                </div>
                <h3 className="text-sm font-bold mb-2 leading-tight" style={{ color: '#0f172a' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LUXURY EXPERIENCES ═══════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: '#fafaf8' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="label-text mb-3">Explore More</p>
              <h2 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                Luxury <span style={{ color: '#7C3AED' }}>Experiences</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {EXPERIENCES.map(({ label, img, path }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                style={{ aspectRatio: '4/5' }}
                onClick={() => navigate(path)}
              >
                <img 
                  src={img} 
                  alt={label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,47,0.85) 0%, transparent 60%)' }} />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-sm font-bold text-white leading-tight px-2">{label}</p>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(10,25,47,0.35)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ background: 'rgba(124,58,237,0.90)', backdropFilter: 'blur(6px)' }}>
                    <FiArrowUpRight className="text-white" size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="py-20 lg:py-28" style={{ background: '#ffffff' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="label-text justify-center mb-3">Happy Travelers</p>
            <h2 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
              What Our Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl transition-all duration-300"
                style={{ background: '#fafaf8', border: '1px solid #f0ede6' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,25,47,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = ''; }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: '#374151' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={t.img} 
                    alt={t.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                    loading="lazy"
                    style={{ border: '2px solid #e8e4dc' }}
                  />
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{t.loc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=85"
          alt="CTA"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'kenBurns 14s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,25,47,0.72)', backdropFilter: 'blur(1px)' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl flex flex-col items-center"
          >
            <span className="section-badge mb-6" style={{ color: '#2563EB', borderColor: 'rgba(212,180,131,0.35)', background: 'rgba(212,180,131,0.12)' }}>
              Ready to Travel?
            </span>
            <h2 className="font-light text-white leading-[1.08] mb-6"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Your Dream <span style={{ color: '#2563EB', fontStyle: 'italic' }}>Journey</span> Awaits
            </h2>
            <p className="mb-10 text-base lg:text-lg font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Let us turn your travel dreams into unforgettable memories with personalized luxury experiences.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handlePackageScroll} className="btn-hero">
                Explore Packages
              </button>
              <Link to="/contact" className="btn-ghost">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
