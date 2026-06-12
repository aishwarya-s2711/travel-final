import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { 
  MapPin, Calendar, DollarSign, Search, Star, Play, 
  ChevronRight, CheckCircle, Shield, Clock, Compass, 
  Phone, Mail, Award, Heart, Map, Plane
} from 'lucide-react';

const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp.default || CountUp);

// Data Constants
const STATS = [
  { icon: Heart, number: 50000, suffix: '+', label: 'Happy Travelers' },
  { icon: Map, number: 500, suffix: '+', label: 'Tour Packages' },
  { icon: MapPin, number: 100, suffix: '+', label: 'Destinations' },
  { icon: Award, number: 15, suffix: '+', label: 'Years Experience' }
];

const DESTINATIONS = [
  { name: 'Maldives', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', rating: 4.9 },
  { name: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', rating: 4.8 },
  { name: 'Santorini', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', rating: 4.9 },
  { name: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', rating: 5.0 },
  { name: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', rating: 4.7 },
  { name: 'Paris', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', rating: 4.8 },
  { name: 'Singapore', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', rating: 4.9 },
  { name: 'Thailand', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80', rating: 4.6 }
];

const PACKAGES = [
  { title: 'Maldives Paradise Escape', cat: 'Luxury', duration: '5 Days / 4 Nights', stars: 5, flight: true, price: '$2,499', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
  { title: 'Bali Exotic Getaway', cat: 'Honeymoon', duration: '7 Days / 6 Nights', stars: 4, flight: true, price: '$1,899', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { title: 'Swiss Alpine Adventure', cat: 'Adventure', duration: '8 Days / 7 Nights', stars: 5, flight: false, price: '$3,299', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
  { title: 'Dubai Luxury Retreat', cat: 'Luxury', duration: '4 Days / 3 Nights', stars: 5, flight: true, price: '$1,599', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  { title: 'Greek Island Hopper', cat: 'International', duration: '10 Days / 9 Nights', stars: 4, flight: true, price: '$2,899', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' },
  { title: 'Thailand Discovery Tour', cat: 'Family', duration: '9 Days / 8 Nights', stars: 4, flight: true, price: '$1,299', img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80' },
  { title: 'Goa Beach Paradise', cat: 'Domestic', duration: '4 Days / 3 Nights', stars: 4, flight: true, price: '$399', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
  { title: 'Kerala Backwaters Houseboat', cat: 'Domestic', duration: '3 Days / 2 Nights', stars: 5, flight: false, price: '$499', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' }
];

const WHY_US = [
  { icon: Star, title: '5-Star Hotels', desc: 'Handpicked premium accommodations globally.' },
  { icon: DollarSign, title: 'Best Price Guarantee', desc: 'Unbeatable rates without hidden charges.' },
  { icon: Compass, title: 'Expert Tour Guides', desc: 'Knowledgeable locals for authentic experiences.' },
  { icon: Phone, title: '24/7 Support', desc: 'Always available to assist you during your trip.' },
  { icon: Shield, title: 'Secure Booking', desc: '100% safe and encrypted transactions.' },
  { icon: Heart, title: 'Personalized Trips', desc: 'Itineraries tailored exactly to your preferences.' }
];

const LUXURY_EXP = [
  { title: 'Beach Escapes', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Mountain Adventures', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Cultural Tours', img: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80' },
  { title: 'Wildlife Safaris', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80' },
  { title: 'Cruise Vacations', img: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Honeymoon Retreats', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80' }
];

const TESTIMONIALS = [
  { name: 'Sarah Jenkins', country: 'United Kingdom', rating: 5, img: 'https://randomuser.me/api/portraits/women/44.jpg', review: 'The Maldives escape was breathtaking. Everything was arranged flawlessly by TravelGo.' },
  { name: 'Michael Chen', country: 'Singapore', rating: 5, img: 'https://randomuser.me/api/portraits/men/32.jpg', review: 'Exceptional service and beautiful hotels. Our family trip to Thailand was unforgettable.' },
  { name: 'Emma Watson', country: 'United States', rating: 5, img: 'https://randomuser.me/api/portraits/women/23.jpg', review: 'Highly recommend the Swiss Alpine adventure! Premium local guides made a huge difference.' },
  { name: 'David Smith', country: 'Australia', rating: 5, img: 'https://randomuser.me/api/portraits/men/61.jpg', review: 'Dubai luxury retreat exceeded all expectations. 24/7 concierge was incredibly helpful.' }
];

const PACKAGE_CATS = ['International', 'Family', 'Luxury', 'Adventure', 'Honeymoon', 'Domestic'];

function StatItem({ item }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  const Icon = item.icon;
  return (
    <div ref={ref} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 rounded-full bg-[#D4A74F]/10 flex items-center justify-center mb-4 text-[#D4A74F]">
        <Icon size={24} />
      </div>
      <div className="text-3xl font-bold text-[#0B1F3A] mb-1">
        {inView ? <CountUpComponent start={0} end={item.number} duration={2} separator="," suffix={item.suffix} /> : `0${item.suffix}`}
      </div>
      <p className="text-sm font-medium text-slate-500">{item.label}</p>
    </div>
  );
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'
];

export default function Home() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Luxury');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredPackages = PACKAGES.filter(p => p.cat === activeCat || activeCat === 'International');

  return (
    <div className="bg-white min-h-screen text-slate-600 font-sans">
      <SEO title="TravelGo — Premium Tour Packages & Bespoke Travel Agency" />

      {/* HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center pt-0 pb-0 !p-0">
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((img, index) => (
            <img 
              key={index}
              src={img} 
              alt="Luxury Travel Background" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/80 to-[#0B1F3A]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight mb-5 drop-shadow-lg" style={{ color: '#FFFFFF' }}>
              Discover The World's <br /><span className="italic font-serif font-medium drop-shadow-xl" style={{ color: '#FFFFFF' }}>Most Beautiful</span> Destinations
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-8 max-w-lg font-light leading-relaxed drop-shadow-md">
              Luxury travel experiences crafted for unforgettable journeys. Explore premium bespoke itineraries tailored just for you.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('/packages')} className="px-6 py-3 bg-gradient-to-r from-[#D4A74F] to-[#E5C158] hover:shadow-lg hover:shadow-[#D4A74F]/30 text-[#0B1F3A] rounded-xl text-sm font-bold tracking-wide transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Explore Packages <ChevronRight size={16} />
              </button>
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-sm font-semibold tracking-wide transition-all flex items-center gap-2">
                <Play size={16} /> Watch Video
              </button>
            </div>
          </motion.div>
        </div>

        {/* ADVANCED SEARCH CARD (Overlapping) */}
        <div className="absolute -bottom-32 left-0 right-0 z-20 px-6">
          <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Where are you going?" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-[#D4A74F] focus:ring-1 focus:ring-[#D4A74F] outline-none transition-all" />
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Travel Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="date" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-[#D4A74F] focus:ring-1 focus:ring-[#D4A74F] outline-none transition-all text-slate-600" />
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-[#D4A74F] focus:ring-1 focus:ring-[#D4A74F] outline-none transition-all appearance-none text-slate-600">
                  <option>Any Budget</option>
                  <option>$1,000 - $3,000</option>
                  <option>$3,000 - $5,000</option>
                  <option>$5,000+</option>
                </select>
              </div>
            </div>
            <div className="w-full md:w-auto mt-5">
              <button className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4A74F] to-[#E5C158] hover:shadow-lg hover:shadow-[#D4A74F]/30 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                <Search size={18} /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="pt-20 pb-20 bg-slate-50" style={{ marginTop: '100px' }}>
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">Trusted by Travelers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => <StatItem key={i} item={stat} />)}
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-3">Iconic Destinations</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Explore the world's most breathtaking places.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.map((dest, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                onClick={() => navigate(`/destinations?search=${dest.name.toLowerCase()}`)}
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-[#D4A74F] text-sm font-medium">
                      <Star size={14} className="fill-[#D4A74F]" /> {dest.rating}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING PACKAGES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-3">Trending Vacation Packages</h2>
              <p className="text-slate-500">Premium packages curated for luxury and comfort.</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {PACKAGE_CATS.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCat === cat ? 'bg-[#0B1F3A] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={pkg.img} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0B1F3A]">
                    {pkg.cat}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-[#D4A74F] mb-3">
                    {[...Array(pkg.stars)].map((_, i) => <Star key={i} size={14} className="fill-[#D4A74F]" />)}
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-tight flex-1">{pkg.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#D4A74F]" /> {pkg.duration}</span>
                    {pkg.flight && <span className="flex items-center gap-1.5"><Plane size={16} className="text-[#D4A74F]" /> Flights Included</span>}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">Starting from</p>
                      <p className="text-2xl font-bold text-[#0B1F3A]">{pkg.price}</p>
                    </div>
                    <button onClick={() => navigate('/packages')} className="px-5 py-2.5 bg-[#0B1F3A] text-white text-sm font-semibold rounded-xl hover:bg-[#152a4a] transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-3">Why Travel With Us</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the pinnacle of luxury travel with our exclusive services.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
              <div key={i} className="flex items-start gap-5 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-[#D4A74F]/10 text-[#D4A74F] flex items-center justify-center shrink-0">
                  <item.icon size={26} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LUXURY EXPERIENCES */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#FFFFFF' }}>Curated Luxury Experiences</h2>
              <p className="text-slate-400">Unique travel styles crafted for your desires.</p>
            </div>
            <button onClick={() => navigate('/packages')} className="hidden md:flex items-center gap-2 text-[#D4A74F] font-semibold hover:text-white transition-colors">
              View All Experiences <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LUXURY_EXP.map((exp, i) => (
              <div key={i} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                <img src={exp.img} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4A74F] transition-colors">{exp.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-3">What Our Clients Say</h2>
            <p className="text-slate-500">Read reviews from our satisfied travelers.</p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, bulletClass: 'swiper-bullet-custom', bulletActiveClass: 'swiper-bullet-active-custom' }}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            className="pb-16"
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
                  <div className="flex gap-1 text-[#D4A74F] mb-6">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-[#D4A74F]" />)}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 italic">"{t.review}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                    <div>
                      <h4 className="font-bold text-[#0B1F3A] text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.country}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-24 !p-0">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" alt="Mountain Adventure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0B1F3A]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Dream Journey Awaits</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">Let us turn your travel dreams into unforgettable memories. Start planning your premium luxury vacation today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/packages')} className="px-8 py-4 w-full sm:w-auto bg-[#D4A74F] hover:bg-[#c49a46] text-white rounded-xl font-bold tracking-wide transition-all shadow-lg hover:-translate-y-1">
              Explore Packages
            </button>
            <button onClick={() => navigate('/contact')} className="px-8 py-4 w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold tracking-wide transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
      
      {/* Custom Swiper Styles for dots */}
      <style>{`
        .swiper-bullet-custom {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #CBD5E1;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-bullet-active-custom {
          background: #D4A74F;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}