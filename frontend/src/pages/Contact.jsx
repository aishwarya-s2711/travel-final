import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import api from '../utils/api';

// Fix Leaflet default marker icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CONTACTS = [
  { Icon: FiMapPin, title: 'HQ Address', lines: ['IIT Campus, Powai Gate Road', 'Powai, Mumbai 400076'] },
  { Icon: FiPhone,  title: 'Call Us',  lines: ['+91 (22) 2572-2545', '+91 (22) 1234-5678'] },
  { Icon: FiMail,   title: 'Support Desk', lines: ['hello@iitctravel.com', 'support@iitctravel.com'] },
  { Icon: FiClock,  title: 'Availability', lines: ['Mon–Sat: 9AM – 7PM', 'Sun: 10AM – 4PM'] },
];

function validate(form) {
  const e = {};
  if (form.name.trim().length < 2) e.name = 'Full name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
  if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters';
  if (form.honeypot) e.honeypot = 'Bot detected';
  return e;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (form.honeypot) return;
    setLoading(true);
    try {
      await api.post('/public/contact', {
        name: form.name,
        email: form.email,
        subject: form.subject || 'General Inquiry',
        message: form.message
      });
      toast.success("Message received! A concierge expert will reply within 12 hours. ✈️");
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Our Concierge Team | TravelGo"
        description="Connect with TravelGo. Reach our luxury travel consultants via email, phone, or live chat."
        canonical="/contact"
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Page Hero */}
        <PageHero
          badge="Concierge Support"
          title="Contact Us"
          subtitle="Our global planners are standing by to coordinate your custom route"
          image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=60"
        />

        {/* Info Grid & Form Section */}
        <section className="py-28 bg-white dark:bg-slate-900 transition-colors" aria-label="Contact channels">
          <div className="max-w-7xl mx-auto px-6">

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {CONTACTS.map(({ Icon, title, lines }, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.08 }}
                  className="rounded-[20px] p-6 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 bg-blue-50 dark:bg-blue-950/45">
                    <Icon className="text-blue-600 dark:text-blue-400" size={18} />
                  </div>
                  <h3 className="font-bold text-base uppercase tracking-wider mb-2 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {title}
                  </h3>
                  {lines.map((l, j) => (
                    <p key={j} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {l}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Form & Map Double-Column */}
            <div className="grid lg:grid-cols-2 gap-12 items-stretch">

              {/* Inquiry Form Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl p-8 lg:p-10 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-center"
              >
                {sent ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-green-50 dark:bg-green-950/20">
                      <span className="text-4xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Inquiry Received!
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Our senior advisor will reach out within 12 hours.</p>
                    <button 
                      onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'',honeypot:'' }); }}
                      className="btn-premium-outline py-3 px-6 h-auto text-xs uppercase tracking-wider cursor-pointer"
                    >
                      New Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 space-y-2">
                      <span className="section-badge">Bespoke Inquiry</span>
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Plan Your Voyage
                      </h2>
                      <p className="text-base text-slate-600 dark:text-slate-300">
                        Fill out the details below and our concierge team will craft your perfect itinerary.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate aria-label="Contact form" className="space-y-5">
                      {/* Honeypot bots catcher */}
                      <input
                        type="text" tabIndex={-1} aria-hidden="true"
                        value={form.honeypot} onChange={e => set('honeypot', e.target.value)}
                        className="absolute left-[-9999px] opacity-0 h-0"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <div className="premium-input-container">
                            <input 
                              id="contact-name" 
                              required 
                              value={form.name} 
                              onChange={e => set('name', e.target.value)}
                              placeholder=" "
                              className={`w-full pl-12 pr-4 h-[58px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all text-base ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' : ''}`}
                              aria-describedby={errors.name ? 'name-err' : undefined}
                            />
                            <FiUser className="absolute left-4 top-[18px] text-slate-400 dark:text-slate-500 text-xl pointer-events-none" />
                          </div>
                          {errors.name && <p id="name-err" role="alert" className="text-xs mt-1.5 pl-2 font-bold text-rose-500 uppercase tracking-wide">{errors.name}</p>}
                        </div>
                        <div>
                          <div className="premium-input-container">
                            <input 
                              id="contact-email" 
                              type="email" 
                              required 
                              value={form.email} 
                              onChange={e => set('email', e.target.value)}
                              placeholder=" "
                              className={`w-full pl-12 pr-4 h-[58px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all text-base ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' : ''}`}
                              aria-describedby={errors.email ? 'email-err' : undefined}
                            />
                            <FiMail className="absolute left-4 top-[18px] text-slate-400 dark:text-slate-500 text-xl pointer-events-none" />
                          </div>
                          {errors.email && <p id="email-err" role="alert" className="text-xs mt-1.5 pl-2 font-bold text-rose-500 uppercase tracking-wide">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <div className="premium-input-container">
                            <input 
                              id="contact-phone" 
                              type="tel" 
                              value={form.phone} 
                              onChange={e => set('phone', e.target.value)}
                              placeholder=" "
                              className="w-full pl-12 pr-4 h-[58px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all text-base"
                            />
                            <FiPhone className="absolute left-4 top-[18px] text-slate-400 dark:text-slate-500 text-xl pointer-events-none" />
                          </div>
                        </div>
                        
                        <div>
                          <select 
                            id="contact-subject" 
                            value={form.subject} 
                            onChange={e => set('subject', e.target.value)}
                            className="w-full h-[58px] px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all text-base font-medium cursor-pointer"
                          >
                            <option value="">Select Category</option>
                            <option value="Tour Inquiry">Tour Inquiry</option>
                            <option value="Custom Package">Custom Package</option>
                            <option value="Booking Support">Booking Support</option>
                            <option value="Visa Assistance">Visa Assistance</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <textarea 
                            id="contact-message" 
                            required 
                            rows={4} 
                            value={form.message} 
                            onChange={e => set('message', e.target.value)}
                            placeholder="Write your custom travel requirements..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all resize-none text-base font-medium placeholder-slate-400 dark:placeholder-slate-500"
                            style={{ borderColor: errors.message ? '#ef4444' : '' }}
                            aria-describedby={errors.message ? 'msg-err' : undefined}
                          />
                          <FiMail className="absolute left-4 top-5 text-slate-400 dark:text-slate-500 text-xl pointer-events-none" />
                        </div>
                        {errors.message && <p id="msg-err" role="alert" className="text-xs mt-1.5 pl-2 font-bold text-rose-500 uppercase tracking-wide">{errors.message}</p>}
                      </div>

                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn-premium w-full mt-4 py-4 text-base font-bold tracking-wide cursor-pointer"
                      >
                        {loading ? 'Sending...' : <><FiSend size={15} /> Submit Inquiry Request</>}
                      </button>
                    </form>

                    {/* WhatsApp CTA Link */}
                    <a 
                      href="https://wa.me/911234567890?text=Hi%20TravelGo!%20I'd%20like%2520to%20plan%20a%20bespoke%20trip." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 mt-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-600 dark:text-green-400 transition-colors"
                    >
                      <FaWhatsapp size={16} /> WhatsApp Live Concierge
                    </a>
                  </>
                )}
              </motion.div>

              {/* Map Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} 
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-[20px] overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[480px]"
              >
                <MapContainer
                  center={[19.123, 72.911]}
                  zoom={15}
                  style={{ height: '100%', flex: 1 }}
                  aria-label="TravelGo location map"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap contributors'
                  />
                  <Marker position={[19.123, 72.911]}>
                    <Popup>
                      <div className="p-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <strong className="text-slate-900 font-bold text-sm">TravelGo HQ</strong><br />
                        <span className="text-xs text-slate-550">IIT Bombay Campus Gate, Powai</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </motion.div>

            </div>

          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
