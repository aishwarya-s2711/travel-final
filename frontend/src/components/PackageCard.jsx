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
        transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="premium-card group"
      >
        {/* Card Image Area */}
        <div className="card-image-wrap relative h-[240px] shrink-0">
          <img
            src={pkg.coverImage || pkg.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'}
            alt={`${pkg.title} — ${pkg.destination}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

          {/* Featured & Discount Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {(pkg.isFeatured || pkg.isBestSeller || pkg.badge) && (
              <span className="text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider text-white bg-blue-600 shadow-lg">
                {pkg.isFeatured ? 'Featured' : pkg.isBestSeller ? 'Best Seller' : pkg.badge}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-rose-600 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <FiStar size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold">{pkg.rating}</span>
            <span className="text-[10px] text-slate-300">({pkg.reviews})</span>
          </div>

          {/* Tour Category */}
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">
              {pkg.category || pkg.type}
            </span>
          </div>
        </div>

        {/* Card Body content */}
        <div className="p-6 flex flex-col flex-1 bg-white dark:bg-slate-900 transition-colors">
          
          <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Link to={`/packages/${pkg._id || pkg.id}`} className="block">
              {pkg.title}
            </Link>
          </h3>
          
          {pkg.shortDescription && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">
              {pkg.shortDescription}
            </p>
          )}

          {/* Travel Stats Info */}
          <div className="flex items-center gap-4 text-[11px] mb-4 flex-wrap text-slate-550 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <FiMapPin size={12} className="text-blue-600 shrink-0" />
              <span className="truncate max-w-[80px]">{pkg.destination}</span>
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={12} className="text-blue-600 shrink-0" />
              <span>{pkg.duration || `${pkg.durationDays}D/${pkg.durationNights}N`}</span>
            </span>
            <span className="flex items-center gap-1">
              <FiUsers size={12} className="text-blue-600 shrink-0" />
              <span>{pkg.availableSeats || pkg.seats} seats</span>
            </span>
          </div>

          {/* Highlights pills */}
          {pkg.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {pkg.highlights.slice(0, 2).map((h, i) => (
                <span key={i} className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-100 dark:border-slate-700">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Price & Book now action */}
          <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 dark:text-slate-500 mb-0.5">Price starting from</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  ${pkg.price?.toLocaleString()}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium">
                    ${pkg.originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer shrink-0"
              aria-label={`Book now for ${pkg.title}`}
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
