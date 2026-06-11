import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiClock, FiUsers, FiCheck, FiX, FiCalendar, FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import api from '../utils/api';
import SuccessModal from '../components/SuccessModal';

const inputStyle = {
  width: '100%', border: '1.5px solid #e8e4dc', borderRadius: 10,
  padding: '12px 16px', fontSize: 16, fontFamily: 'DM Sans, sans-serif',
  outline: 'none', color: '#1a1a1a', background: '#fff', transition: 'border-color 0.2s',
};

export default function PackageDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({ persons: 1, date: '', name: user?.name || '', phone: '', email: user?.email || '' });
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/packages/${id}`);
        setPkg(res.data);
        
        // Fetch related
        if (res.data && res.data.type) {
          const relRes = await api.get(`/packages?type=${res.data.type}&limit=3`);
          setRelated(relRes.data.packages?.filter(p => p._id !== res.data._id) || []);
        }
      } catch (err) {
        console.error('Failed to load package', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f2' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }
  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f2' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">✈️</div>
          <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>Package not found</h2>
          <Link to="/packages" className="btn-primary">Browse Packages</Link>
        </div>
      </div>
    );
  }

  const images  = pkg.images?.length > 0 ? pkg.images : [pkg.image || 'https://via.placeholder.com/800x600'];
  const tabs    = ['overview', 'itinerary', 'inclusions', 'hotel & transport', 'policies', 'reviews'];
  const total   = pkg.price * booking.persons;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!booking.date) { toast.error('Please select a travel date'); return; }
    
    try {
      const totalAmount = pkg.price * booking.persons;
      
      const res = await api.post('/bookings', {
        packageId: pkg._id || pkg.id,
        packageName: pkg.title,
        destination: pkg.destination,
        persons: booking.persons,
        travelDate: booking.date,
        totalAmount: totalAmount,
        specialReq: ''
      });
      
      if (res.data.success || res.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Booking request failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen page-enter" style={{ background: '#f8f6f2', paddingTop: 120 }}>
      <SEO
        title={pkg.title}
        description={`${pkg.duration} luxury tour to ${pkg.destination}. From $${pkg.price.toLocaleString()}/person. ${pkg.highlights?.join(', ')}.`}
        image={pkg.image}
        canonical={`/packages/${pkg.id}`}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back */}
        <Link to="/packages"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-8 transition-all"
          style={{ color: '#7C3AED' }}
          onMouseEnter={e => e.currentTarget.style.gap = '10px'}
          onMouseLeave={e => e.currentTarget.style.gap = ''}>
          <FiArrowLeft size={14} /> Back to Packages
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.07)' }}>
              <div className="relative h-80 overflow-hidden">
                <img src={images[activeImg]} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,47,0.60), transparent 60%)' }} />
                {pkg.badge && (
                  <span className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }}>
                    {pkg.badge}
                  </span>
                )}
              </div>
              <div className="flex gap-2 p-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="h-16 w-20 rounded-lg overflow-hidden transition-all shrink-0"
                    style={{ border: `2px solid ${activeImg === i ? '#7C3AED' : 'transparent'}` }}
                    aria-label={`View image ${i + 1}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Meta */}
            <div className="rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="section-badge mb-3">{pkg.type}</span>
                  <h1 className="text-3xl lg:text-4xl font-light mb-3"
                    style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                    {pkg.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-[0.8125rem]" style={{ color: '#4b5563' }}>
                    <span className="flex items-center gap-1.5"><FiMapPin size={12} style={{ color: '#7C3AED' }} />{pkg.destination}</span>
                    <span className="flex items-center gap-1.5"><FiClock size={12} style={{ color: '#7C3AED' }} />{pkg.duration}</span>
                    <span className="flex items-center gap-1.5"><FiUsers size={12} style={{ color: '#7C3AED' }} />{pkg.seats} seats</span>
                    <span className="flex items-center gap-1.5">
                      <FiStar size={14} style={{ color: '#7C3AED', fill: '#7C3AED' }} />
                      {pkg.rating} <span style={{ color: '#aaa' }}>({pkg.reviews} reviews)</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Starting from</p>
                  <p className="text-4xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                    ${pkg.price.toLocaleString()}
                  </p>
                  {pkg.originalPrice && (
                    <p className="text-sm line-through" style={{ color: '#bbb' }}>${pkg.originalPrice.toLocaleString()}</p>
                  )}
                  <p className="text-xs font-medium" style={{ color: '#4b5563' }}>per person</p>
                </div>
              </div>

              {/* Highlights */}
              {pkg.highlights?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5" style={{ borderTop: '1px solid #f0ede6' }}>
                  {pkg.highlights.map((h, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.20)' }}>
                      ✦ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
              <div className="flex border-b overflow-x-auto" style={{ borderColor: '#f0ede6' }} role="tablist">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    role="tab"
                    aria-selected={activeTab === tab}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider capitalize whitespace-nowrap transition-all"
                    style={{
                      borderBottom: `2px solid ${activeTab === tab ? '#7C3AED' : 'transparent'}`,
                      color: activeTab === tab ? '#0f172a' : '#888',
                      background: activeTab === tab ? 'rgba(124,58,237,0.04)' : 'transparent',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6" role="tabpanel">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                      Package Overview
                    </h3>
                    <p className="text-base leading-[1.85]" style={{ color: '#374151' }}>
                      {pkg.detailedDescription || `Experience the ultimate ${pkg.destination} adventure with our curated ${pkg.duration} package. This thoughtfully crafted itinerary blends iconic landmarks, authentic cultural immersion, and premium accommodations — every detail arranged by our expert concierge team so you can focus entirely on the experience.`}
                    </p>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div>
                    <h3 className="text-xl font-light mb-6" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                      Day-by-Day Itinerary
                    </h3>
                    <div className="space-y-4">
                      {pkg.itinerary?.map((day, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                          className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                              {day.day}
                            </div>
                            {i < pkg.itinerary.length - 1 && (
                              <div className="w-px flex-1 mt-2" style={{ background: 'rgba(124,58,237,0.25)' }} />
                            )}
                          </div>
                          <div className="pb-6 flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: '#0f172a', fontSize: '0.9375rem' }}>{day.title}</h4>
                            <p className="leading-7" style={{ color: '#4b5563', fontSize: '0.875rem' }}>{day.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'inclusions' && (
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm" style={{ color: '#065f46' }}>
                        <FiCheck size={16} /> What's Included
                      </h3>
                      <ul className="space-y-3">
                        {pkg.inclusions?.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#4a4a4a' }}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: 'rgba(16,185,129,0.12)' }}>
                              <FiCheck size={10} style={{ color: '#10b981' }} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm" style={{ color: '#991b1b' }}>
                        <FiX size={16} /> Not Included
                      </h3>
                      <ul className="space-y-3">
                        {pkg.exclusions?.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm" style={{ color: '#4a4a4a' }}>
                            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: 'rgba(239,68,68,0.08)' }}>
                              <FiX size={10} style={{ color: '#ef4444' }} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'hotel & transport' && (
                  <div className="space-y-8">
                    {/* Hotel Info */}
                    {pkg.hotelInfo && pkg.hotelInfo.length > 0 && (
                      <div>
                        <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                          Accommodation
                        </h3>
                        <div className="space-y-4">
                          {pkg.hotelInfo.map((hotel, i) => (
                            <div key={i} className="p-5 border rounded-xl" style={{ borderColor: '#f0ede6', background: '#fff' }}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-lg text-slate-800">{hotel.name}</h4>
                                  <p className="text-sm text-slate-500">{hotel.location}</p>
                                </div>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: hotel.rating || 3 }).map((_, j) => (
                                    <FiStar key={j} size={14} className="text-amber-400 fill-amber-400" />
                                  ))}
                                </div>
                              </div>
                              {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {hotel.amenities.map((amenity, j) => (
                                    <span key={j} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transport & Meals */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {pkg.transportInfo && (
                        <div>
                          <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                            Transportation
                          </h3>
                          <div className="p-5 border rounded-xl" style={{ borderColor: '#f0ede6', background: '#fafaf8' }}>
                            <p className="font-semibold text-slate-800 mb-1">{pkg.transportInfo.type}</p>
                            <p className="text-sm text-slate-600">{pkg.transportInfo.details}</p>
                          </div>
                        </div>
                      )}

                      {pkg.mealPlan && (
                        <div>
                          <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                            Meal Plan
                          </h3>
                          <div className="p-5 border rounded-xl" style={{ borderColor: '#f0ede6', background: '#fafaf8' }}>
                            <p className="text-sm font-medium text-slate-800">{pkg.mealPlan}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div className="space-y-8">
                    {pkg.cancellationPolicy && (
                      <div>
                        <h3 className="text-xl font-light mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                          Cancellation Policy
                        </h3>
                        <div className="p-5 rounded-xl text-sm leading-relaxed whitespace-pre-line text-slate-700 bg-rose-50 border border-rose-100">
                          {pkg.cancellationPolicy}
                        </div>
                      </div>
                    )}

                    {pkg.termsAndConditions && (
                      <div>
                        <h3 className="text-xl font-light mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                          Terms & Conditions
                        </h3>
                        <div className="p-5 rounded-xl text-sm leading-relaxed whitespace-pre-line text-slate-700 bg-slate-50 border border-slate-200">
                          {pkg.termsAndConditions}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-light mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                      Customer Reviews
                    </h3>
                    <div className="flex items-center gap-5 mb-6 p-5 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                      <div className="text-5xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                        {pkg.rating}
                      </div>
                      <div>
                        <div className="flex gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar key={i} size={14}
                              style={{ color: '#7C3AED', fill: i < Math.floor(pkg.rating) ? '#7C3AED' : 'none' }} />
                          ))}
                        </div>
                        <p className="text-[0.8125rem]" style={{ color: '#4b5563' }}>Based on {pkg.reviews} verified reviews</p>
                      </div>
                    </div>
                    <p className="text-base" style={{ color: '#4b5563' }}>
                      Complete this tour to leave a review and help other travelers.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <aside>
            <div className="rounded-2xl p-6 sticky top-28" style={{ background: '#fff', boxShadow: '0 12px 40px rgba(10,25,47,0.10)' }}>
              <h3 className="text-2xl font-light mb-1" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                Book This Package
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                  ${pkg.price.toLocaleString()}
                </span>
                <span className="text-sm" style={{ color: '#aaa' }}>/ person</span>
              </div>

              <form onSubmit={handleBooking} className="space-y-4" aria-label="Booking form">
                <div>
                  <label htmlFor="book-name" className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Full Name</label>
                  <input id="book-name" required value={booking.name}
                    onChange={e => setBooking({ ...booking, name: e.target.value })}
                    style={inputStyle} placeholder=""
                    onFocus={e => e.target.style.borderColor = '#7C3AED'}
                    onBlur={e => e.target.style.borderColor = '#e8e4dc'} />
                </div>

                <div>
                  <label htmlFor="book-email" className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Email</label>
                  <input id="book-email" type="email" required value={booking.email}
                    onChange={e => setBooking({ ...booking, email: e.target.value })}
                    style={inputStyle} placeholder=""
                    onFocus={e => e.target.style.borderColor = '#7C3AED'}
                    onBlur={e => e.target.style.borderColor = '#e8e4dc'} />
                </div>

                <div>
                  <label htmlFor="book-date" className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Travel Date</label>
                  <div className="relative">
                    <FiCalendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7C3AED' }} />
                    <input id="book-date" type="date" required value={booking.date}
                      onChange={e => setBooking({ ...booking, date: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: 36 }}
                      onFocus={e => e.target.style.borderColor = '#7C3AED'}
                      onBlur={e => e.target.style.borderColor = '#e8e4dc'} />
                  </div>
                </div>

                <div>
                  <label htmlFor="book-persons" className="block text-sm font-semibold mb-1.5" style={{ color: '#0f172a' }}>Travelers</label>
                  <div className="relative">
                    <FiUsers size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7C3AED' }} />
                    <select id="book-persons" value={booking.persons}
                      onChange={e => setBooking({ ...booking, persons: Number(e.target.value) })}
                      style={{ ...inputStyle, paddingLeft: 36, cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price summary */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: '#888' }}>${pkg.price.toLocaleString()} × {booking.persons}</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: '#888' }}>Service fee</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2" style={{ borderTop: '1px solid rgba(124,58,237,0.20)', color: '#0f172a' }}>
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" className="btn-luxury w-full justify-center !py-4" style={{ width: '100%' }}>
                  Book Now 🎉
                </button>
                <button type="button" onClick={(e) => { e.preventDefault(); toast.info('Redirecting to Google Pay...'); setTimeout(() => handleBooking(e), 1500); }} className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-slate-200 shadow-sm bg-white hover:bg-slate-50 transition-all font-bold text-slate-800">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-4" />
                  Pay with GPay
                </button>
                <p className="text-center text-[0.8125rem] mt-4" style={{ color: '#4b5563' }}>
                  Free cancellation within 24 hours of booking
                </p>
              </form>

              {/* Trust badges */}
              <div className="flex justify-center gap-3 mt-4 flex-wrap">
                {['🔒 Secure', '✅ Verified', '💰 Best Price'].map(b => (
                  <span key={b} className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: '#f8f6f2', color: '#4b5563' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Packages */}
        {related.length > 0 && (
          <section className="mt-16" aria-label="Related packages">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full" style={{ background: '#7C3AED' }} />
              <h2 className="text-3xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => <PackageCard key={p.id} pkg={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal 
            onClose={() => {
              setShowSuccessModal(false);
              navigate('/dashboard/bookings');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
