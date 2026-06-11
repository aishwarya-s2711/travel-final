import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DestinationCard({ destination }) {
  const { id, name, country, category, image, description } = destination;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="luxury-card group"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 208, borderRadius: '20px 20px 0 0' }}>
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,25,47,0.70) 0%, transparent 60%)' }} />
        {category && (
          <span className="absolute top-3 left-3 text-[10px] font-black tracking-[0.10em] uppercase px-2.5 py-1 rounded-md"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#0f172a' }}>
            {category}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.80)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          aria-label="Add to favorites">
          <FiHeart size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="text-xl font-light mb-1" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>{name}</h3>
        <p className="text-xs font-bold tracking-[0.10em] uppercase mb-3 flex items-center gap-1.5" style={{ color: '#7C3AED' }}>
          <FiMapPin size={11} />{country}
        </p>
        <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: '#6b7280' }}>{description}</p>
        <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid #f0ede6' }}>
          <Link to={`/destinations/${id}`}
            className="text-xs font-black uppercase tracking-wider transition-colors hover:text-[#7C3AED]"
            style={{ color: '#0f172a' }}>
            View Details
          </Link>
          <Link
            to={`/destinations/${id}`}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ background: '#0f172a', color: '#fff' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.transform = ''; }}
            aria-label={`View ${name} details`}>
            <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
