import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import SEO from '../components/SEO';

const SUGGESTIONS = [
  { label: 'Explore Packages', path: '/packages' },
  { label: 'Browse Destinations', path: '/destinations' },
  { label: 'About TravelGo', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist. Explore our luxury travel packages instead." />
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden page-enter"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1a3a5c 100%)' }}>

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=30"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />

        {/* Gold top line */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, transparent)' }} />

        <div className="relative text-center px-6 py-20 max-w-2xl">
          {/* 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-light mb-2" style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(120px, 20vw, 200px)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #7C3AED 0%, #e8d5a3 50%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              404
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="h-px max-w-xs mx-auto mb-8"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)' }} />
            <h1 className="text-3xl lg:text-5xl font-light text-white mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              Lost in Paradise?
            </h1>
            <p className="mb-10 text-lg font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>
              The page you're looking for has sailed away. Let us guide you back to your next adventure.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-10"
          >
            {SUGGESTIONS.map(s => (
              <Link
                key={s.path}
                to={s.path}
                className="flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-medium transition-all group"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.75)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.12)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.color = '#2563EB'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                {s.label}
                <HiArrowLongRight size={16} />
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="btn-luxury">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
