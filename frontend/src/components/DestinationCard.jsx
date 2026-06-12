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
      className="premium-card group"
    >
      {/* Card Image Area */}
      <div className="card-image-wrap relative h-[240px] shrink-0">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
        
        {category && (
          <span className="absolute top-4 left-4 text-[9px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full text-white bg-blue-600 shadow-md">
            {category}
          </span>
        )}
        
        <button 
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all text-white bg-slate-950/40 backdrop-blur-md hover:bg-rose-600 border border-white/10 cursor-pointer"
          aria-label="Add to favorites"
        >
          <FiHeart size={13} />
        </button>
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex flex-col flex-1 bg-white dark:bg-slate-900 transition-colors">
        
        <h3 className="text-xl font-bold mb-1.5 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {name}
        </h3>
        
        <p className="text-[10px] font-bold tracking-wider uppercase mb-3 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <FiMapPin size={11} className="text-blue-500" />{country}
        </p>
        
        <p className="text-xs line-clamp-2 mb-6 leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
          <Link 
            to={`/destinations/${id}`}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-900 dark:text-slate-205 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Explore Destination
          </Link>
          <Link
            to={`/destinations/${id}`}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            aria-label={`View ${name} details`}
          >
            <FiArrowRight size={13} />
          </Link>
        </div>

      </div>
    </motion.article>
  );
}
