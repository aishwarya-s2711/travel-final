import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

export default function PageHero({ badge, title, subtitle, image, breadcrumb }) {
  const bg = image || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=60';
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: 'clamp(130px, 14vw, 180px)', paddingBottom: 'clamp(64px, 8vw, 96px)' }}
      aria-label={`${title} hero`}
    >
      <img src={bg} alt="" aria-hidden="true" loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: 'kenBurns 14s ease-in-out infinite alternate' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,25,47,0.72) 0%, rgba(10,25,47,0.55) 50%, rgba(10,25,47,0.80) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }} />
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, transparent)' }} />

      <div className="relative max-w-4xl mx-auto px-6 text-center" style={{ zIndex: 1 }}>
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="flex items-center justify-center gap-1.5 mb-5 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.60)' }}>
            <Link to="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
            <FiChevronRight size={12} />
            <span style={{ color: '#2563EB' }}>{title}</span>
          </div>
        )}

        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-5"
          >
            <span className="section-badge" style={{ color: '#2563EB', borderColor: 'rgba(212,180,131,0.35)', background: 'rgba(212,180,131,0.10)' }}>
              {badge}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 font-light"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            background: 'linear-gradient(to bottom, #ffffff 30%, #f7ebd3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.55))',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(244,237,226,0.90)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
