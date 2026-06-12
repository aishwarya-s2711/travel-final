import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight, FiArrowUp, FiSend } from 'react-icons/fi';

const SOCIALS = [
  { Icon: FaFacebook,  href: 'https://facebook.com/iitctravel',  label: 'Facebook' },
  { Icon: FaInstagram, href: 'https://instagram.com/iitctravel',  label: 'Instagram' },
  { Icon: FaTwitter,   href: 'https://twitter.com/iitctravel',    label: 'Twitter' },
  { Icon: FaYoutube,   href: 'https://youtube.com/iitctravel',    label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F3A] text-white/70 border-t border-white/10 font-sans">
      
      {/* Premium CTA Strip */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#D4A74F] to-[#E5C158]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-[#0B1F3A]">
            <div className="w-2 h-2 rounded-full bg-[#0B1F3A] animate-pulse" />
            <p className="text-sm font-bold tracking-tight">
              Start your journey today — <span>Talk to our travel experts</span>
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white bg-[#0B1F3A] hover:bg-[#152a4a] shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Get Started
            <FiArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit" aria-label="TravelGo Home">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D4A74F] to-[#E5C158] shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                  <path d="M24 6C18.268 6 13 11.268 13 18C13 26 24 38 24 38C24 38 35 26 35 18C35 11.268 29.732 6 24 6Z" fill="white" opacity="0.95"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight leading-none mb-0.5">
                  TravelGo
                </span>
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-[#D4A74F]">
                  Premium travel agency
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-white/60">
              Bespoke travel designers crafting hyper-curated, luxury tour itineraries. From 5★ boutique hotels to local guides and 24/7 concierge assistance, we guarantee excellence.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#D4A74F] text-white/70 hover:text-[#D4A74F] transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                ['Home', '/'],
                ['Packages', '/packages'],
                ['Destinations', '/destinations'],
                ['Track Trip', '/track-trip'],
                ['About Us', '/about'],
                ['Contact', '/contact']
              ].map(([label, path]) => (
                <li key={path}>
                  <Link 
                    to={path} 
                    className="text-sm text-white/60 hover:text-[#D4A74F] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Destinations Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-wide text-white">
              Destinations
            </h3>
            <ul className="space-y-3">
              {['Maldives', 'Bali', 'Switzerland', 'Dubai', 'Greece', 'Singapore'].map(d => (
                <li key={d}>
                  <Link 
                    to={`/destinations?search=${d.toLowerCase()}`} 
                    className="text-sm text-white/60 hover:text-[#D4A74F] transition-colors"
                  >
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold tracking-wide text-white">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex gap-3 items-start">
                <FiPhone size={16} className="shrink-0 mt-0.5 text-[#D4A74F]" />
                <a href="tel:+912225722545" className="hover:text-white transition-colors">+91 (22) 2572-2545</a>
              </li>
              <li className="flex gap-3 items-start">
                <FiMail size={16} className="shrink-0 mt-0.5 text-[#D4A74F]" />
                <a href="mailto:hello@iitctravel.com" className="hover:text-white transition-colors">hello@iitctravel.com</a>
              </li>
              <li className="flex gap-3 items-start">
                <FiMapPin size={16} className="shrink-0 mt-0.5 text-[#D4A74F]" />
                <span>IIT Campus Powai, Mumbai, Maharashtra 400076</span>
              </li>
            </ul>

            {/* Newsletter Section */}
            <div className="border-t border-white/10 pt-6 space-y-3">
              <p className="text-xs uppercase font-bold tracking-widest text-white/80">Subscribe for Privileges</p>
              <form onSubmit={e => e.preventDefault()} className="flex gap-2">
                <div className="relative flex-1">
                  <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#D4A74F] focus:ring-1 focus:ring-[#D4A74F]/50 placeholder-white/30 transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0B1F3A] bg-[#D4A74F] hover:bg-[#E5C158] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <FiSend size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Copyright Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/50">
          <p>© {new Date().getFullYear()} TravelGo. Premium Travel Agency.</p>
          <div className="flex items-center gap-6">
            {[['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms'], ['FAQ', '/faq']].map(([title, link]) => (
              <Link key={title} to={link} className="hover:text-[#D4A74F] transition-colors">{title}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#0B1F3A] border border-[#D4A74F] text-[#D4A74F] flex items-center justify-center shadow-xl hover:bg-[#D4A74F] hover:text-[#0B1F3A] transition-all duration-300 z-50 group hover:-translate-y-1"
        aria-label="Scroll to top"
      >
        <FiArrowUp size={20} className="group-hover:animate-bounce" />
      </button>

    </footer>
  );
}