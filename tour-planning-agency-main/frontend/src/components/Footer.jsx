import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const SOCIALS = [
  { Icon: FaFacebook,  href: 'https://facebook.com/travelgo',  label: 'Facebook' },
  { Icon: FaInstagram, href: 'https://instagram.com/travelgo',  label: 'Instagram' },
  { Icon: FaTwitter,   href: 'https://twitter.com/travelgo',    label: 'Twitter' },
  { Icon: FaYoutube,   href: 'https://youtube.com/travelgo',    label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0f172a 0%, #061020 100%)', color: 'rgba(255,255,255,0.72)' }}>
      {/* Gold rule */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.55) 50%, transparent)' }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group w-fit" aria-label="TravelGo Home">
              <div className="w-12 h-12 rounded-[12px] flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white">
                  <path d="M12 2C8.134 2 5 5.134 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.134 15.866 2 12 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>TravelGo</span>
                <span className="text-[9px] font-semibold tracking-[0.12em] uppercase mt-1" style={{ color: '#7C3AED' }}>Explore. Discover. Experience</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
              We create unforgettable travel experiences with premium services and best prices.
            </p>

            <div className="flex gap-2.5 mb-8">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #2563EB)'; e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <Icon size={14} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-xs font-black tracking-[0.12em] uppercase mb-5" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[['Home','/'],['Packages','/packages'],['Destinations','/destinations'],['Track Trip','/track'],['About Us','/about'],['Contact','/contact']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="group flex items-center gap-2 text-sm transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.70)', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Top Destinations */}
          <nav aria-label="Top destinations">
            <h3 className="text-xs font-black tracking-[0.12em] uppercase mb-5" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>
              Top Destinations
            </h3>
            <ul className="space-y-2.5">
              {['Maldives','Bali','Switzerland','Dubai','Thailand','Singapore'].map(d => (
                <li key={d}>
                  <Link to="/destinations" className="group flex items-center gap-2 text-sm transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.70)', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all">{d}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-xs font-black tracking-[0.12em] uppercase mb-5" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>
              Contact Us
            </h3>
            <ul className="space-y-3 mb-7">
              <li className="flex gap-2.5 items-start text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FiPhone size={13} className="shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                <a href="tel:+18881234567" className="hover:text-[#2563EB] transition-colors">+1 (888) 123-4567</a>
              </li>
              <li className="flex gap-2.5 items-start text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FiMail size={13} className="shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                <a href="mailto:info@travelgo.com" className="hover:text-[#2563EB] transition-colors">info@travelgo.com</a>
              </li>
              <li className="flex gap-2.5 items-start text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <FiMapPin size={13} className="shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
                <span>123 Travel Street,<br />New York, USA 10001</span>
              </li>
            </ul>

            {/* Newsletter */}
            <h3 className="text-xs font-black tracking-[0.12em] uppercase mb-3" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>
              Newsletter
            </h3>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Subscribe to get special offers, travel tips & more!
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.18)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.boxShadow = 'none'; }}
                required
              />
              <button type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#0f172a', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.40)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.42)', fontFamily: 'DM Sans, sans-serif' }}>
          <p>© {new Date().getFullYear()} TravelGo. All Rights Reserved.</p>
          <div className="flex gap-6">
            {[['Privacy Policy','/privacy'],['Terms & Conditions','/terms'],['Refund Policy','/faq']].map(([title, link]) => (
              <Link key={title} to={link} className="transition-colors duration-200 hover:text-[#2563EB]">{title}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
