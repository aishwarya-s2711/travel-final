import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiArrowRight, FiClock, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DestinationCard({ destination, pkg }) {
  const { name, country, category, image, description } = destination;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card group flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Card Image Area */}
      <div className="card-image-wrap relative h-[220px] shrink-0 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
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

        {/* Dynamic Price Display */}
        {pkg && (
          <div className="absolute bottom-4 left-4 flex flex-col">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Starts from</span>
            <span className="text-xl font-extrabold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ${pkg.price.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900 transition-colors">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {name}
          </h3>
          {pkg && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
              <FiStar className="fill-amber-500" size={12} />
              <span>{pkg.rating || '4.9'}</span>
            </div>
          )}
        </div>
        
        <p className="text-[10px] font-bold tracking-wider uppercase mb-3 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <FiMapPin size={11} className="text-blue-500" />{country}
        </p>
        
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-4 flex-grow">
          {description}
        </p>

        {/* Duration Details */}
        {pkg && (
          <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <FiClock size={13} className="text-slate-400" />
            <span>{pkg.duration || '5 Days / 4 Nights'}</span>
          </div>
        )}



        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          {pkg && (
            <div className="flex gap-2.5">
              <Link
                to={`/packages/${pkg._id || pkg.id}`}
                className="flex-1 text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                to={`/packages/${pkg._id || pkg.id}`}
                className="flex-1 text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                View Details
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Link 
              to={`/destinations/${encodeURIComponent(name)}`}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Explore Destination
            </Link>
            <Link
              to={`/destinations/${encodeURIComponent(name)}`}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              aria-label={`View ${name} details`}
            >
              <FiArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>
    </motion.article>
  );
}
