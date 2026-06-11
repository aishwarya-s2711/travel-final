import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import { HiArrowLongRight } from 'react-icons/hi2';
import BookingModal from './BookingModal';

export default function PackageCard({ pkg, index = 0 }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discount = pkg.originalPrice ? Math.round((1 - pkg.price / pkg.originalPrice) * 100) : 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        className="luxury-card group"
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 220, borderRadius: '20px 20px 0 0' }}>
          <img
            src={pkg.coverImage || pkg.image || 'https://via.placeholder.com/600x400'}
            alt={`${pkg.title} — ${pkg.destination}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,47,0.80) 0%, rgba(10,25,47,0.15) 55%, transparent 100%)' }} />

          {/* Badges */}
          {(pkg.isFeatured || pkg.isBestSeller || pkg.badge) && (
            <span className="absolute top-3.5 left-3.5 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-[0.1em]"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#0f172a' }}>
              {pkg.isFeatured ? 'Featured' : pkg.isBestSeller ? 'Best Seller' : pkg.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3.5 right-3.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              -{discount}%
            </span>
          )}

          {/* Rating */}
          <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(10,25,47,0.65)', backdropFilter: 'blur(6px)' }}>
            <FiStar size={11} style={{ color: '#2563EB', fill: '#2563EB' }} />
            <span className="text-xs font-bold text-white">{pkg.rating}</span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.70)' }}>({pkg.reviews})</span>
          </div>

          {/* Bottom text */}
          <div className="absolute bottom-3.5 left-3.5 w-[85%]">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-0.5" style={{ color: 'rgba(212,180,131,0.90)' }}>{pkg.category || pkg.type}</p>
            <h3 className="text-white text-lg font-light leading-tight drop-shadow truncate w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Link to={`/packages/${pkg._id || pkg.id}`} className="hover:text-blue-200 transition-colors">{pkg.title}</Link>
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="flex items-center gap-4 text-xs mb-4 flex-wrap" style={{ color: '#6b7280' }}>
            <span className="flex items-center gap-1.5">
              <FiMapPin size={11} style={{ color: '#7C3AED' }} />{pkg.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock size={11} style={{ color: '#7C3AED' }} />{pkg.duration || `${pkg.durationDays}D/${pkg.durationNights}N`}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUsers size={11} style={{ color: '#7C3AED' }} />{pkg.availableSeats || pkg.seats} seats
            </span>
          </div>

          {pkg.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {pkg.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.08)', color: '#8f6c31', border: '1px solid rgba(124,58,237,0.18)' }}>
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-auto"
            style={{ borderTop: '1px solid #f0ede6' }}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.10em] font-bold mb-0.5" style={{ color: '#9ca3af' }}>From</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-light" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                  ${pkg.price?.toLocaleString()}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs line-through" style={{ color: '#9ca3af' }}>
                    ${pkg.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>per person</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300"
              style={{ background: '#0f172a', color: '#fff', letterSpacing: '0.08em' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              aria-label={`Book ${pkg.title}`}
            >
              Book Now <HiArrowLongRight size={14} />
            </button>
          </div>
        </div>
      </motion.article>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pkg={pkg} />
    </>
  );
}
