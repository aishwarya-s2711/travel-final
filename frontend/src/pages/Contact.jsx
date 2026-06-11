import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CONTACTS = [
  { Icon: FiMapPin, title: 'Visit Us', lines: ['123 Travel Street', 'Bandra West, Mumbai 400050'] },
  { Icon: FiPhone,  title: 'Call Us',  lines: ['+91 12345 67890', '+91 98765 43210'] },
  { Icon: FiMail,   title: 'Email Us', lines: ['hello@travelgo.com', 'support@travelgo.com'] },
  { Icon: FiClock,  title: 'Working Hours', lines: ['Mon–Sat: 9AM – 7PM', 'Sun: 10AM – 4PM'] },
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
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    toast.success("Message sent! We'll get back to you within 24 hours. ✈️");
    setSent(true);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with TravelGo's luxury travel consultants. We're available Mon–Sat 9AM–7PM to help plan your perfect journey."
        canonical="/contact"
      />
      <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
        <PageHero
          badge="Get In Touch"
          title="Contact Us"
          subtitle="Our travel concierge team is here to craft your perfect journey"
          image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=60"
        />

        <section className="py-20" style={{ background: '#ffffff' }} aria-label="Contact information and form">
          <div className="max-w-7xl mx-auto px-6">

            {/* Contact Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {CONTACTS.map(({ Icon, title, lines }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-6 text-center transition-all group"
                  style={{ background: '#fff', boxShadow: '0 2px 12px rgba(10,25,47,0.06)', border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.30)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,25,47,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(10,25,47,0.06)'; }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all"
                    style={{ background: 'rgba(124,58,237,0.10)' }}>
                    <Icon style={{ color: '#7C3AED' }} size={20} />
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', fontSize: '1rem' }}>
                    {title}
                  </h3>
                  {/* text-sm + #4b5563 = 7.4:1 on white — WCAG AA ✓ (was text-xs + #888 = 3.5:1, fail) */}
                  {lines.map((l, j) => <p key={j} className="text-sm" style={{ color: '#4b5563', lineHeight: 1.8 }}>{l}</p>)}
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl p-8 lg:p-10 h-full flex flex-col"
                style={{ background: '#fff', boxShadow: '0 8px 32px rgba(10,25,47,0.08)' }}
              >
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: 'rgba(124,58,237,0.10)' }}>
                      <span style={{ fontSize: 36 }}>✅</span>
                    </div>
                    <h3 className="text-3xl font-light mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                      Message Sent!
                    </h3>
                    {/* text-base + #4b5563 = 7.4:1 — WCAG AA ✓ */}
                    <p className="text-base mb-8" style={{ color: '#4b5563' }}>Our team will respond within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',subject:'',message:'',honeypot:'' }); }}
                      className="btn-outline">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <span className="section-badge">Send a Message</span>
                      <h2 className="text-3xl font-light mt-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                        Plan Your Journey
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                      {/* Honeypot — hidden from humans */}
                      <input
                        type="text" tabIndex={-1} aria-hidden="true"
                        value={form.honeypot} onChange={e => set('honeypot', e.target.value)}
                        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                      />

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          {/* text-sm form labels: meets 14px minimum for form accessibility */}
                          <label htmlFor="contact-name" className="block text-sm font-semibold mb-1.5 tracking-wide" style={{ color: '#0f172a' }}>
                            Full Name <span style={{ color: '#7C3AED' }}>*</span>
                          </label>
                          <input id="contact-name" required value={form.name} onChange={e => set('name', e.target.value)}
                            className="form-input text-center" placeholder=""
                            style={errors.name ? { borderColor: '#ef4444' } : {}}
                            aria-describedby={errors.name ? 'name-err' : undefined}
                          />
                          {errors.name && <p id="name-err" role="alert" className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-sm font-semibold mb-1.5 tracking-wide" style={{ color: '#0f172a' }}>
                            Email <span style={{ color: '#7C3AED' }}>*</span>
                          </label>
                          <input id="contact-email" type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                            className="form-input text-center" placeholder=""
                            style={errors.email ? { borderColor: '#ef4444' } : {}}
                            aria-describedby={errors.email ? 'email-err' : undefined}
                          />
                          {errors.email && <p id="email-err" role="alert" className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="contact-phone" className="block text-sm font-semibold mb-1.5 tracking-wide" style={{ color: '#0f172a' }}>Phone</label>
                          <input id="contact-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                            className="form-input text-center" placeholder="" />
                        </div>
                        <div>
                          <label htmlFor="contact-subject" className="block text-sm font-semibold mb-1.5 tracking-wide" style={{ color: '#0f172a' }}>Subject</label>
                          <select id="contact-subject" value={form.subject} onChange={e => set('subject', e.target.value)} className="form-input text-center">
                            <option value="">Select subject</option>
                            <option>Tour Inquiry</option>
                            <option>Custom Package</option>
                            <option>Booking Support</option>
                            <option>Visa Assistance</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="contact-message" className="block text-sm font-semibold mb-1.5 tracking-wide" style={{ color: '#0f172a' }}>
                          Message <span style={{ color: '#7C3AED' }}>*</span>
                        </label>
                        <textarea id="contact-message" required rows={5} value={form.message} onChange={e => set('message', e.target.value)}
                          className="form-input resize-none text-center" placeholder=""
                          style={{ ...(errors.message ? { borderColor: '#ef4444' } : {}), paddingTop: '12px' }}
                          aria-describedby={errors.message ? 'msg-err' : undefined}
                        />
                        {errors.message && <p id="msg-err" role="alert" className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.message}</p>}
                      </div>

                      <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4"
                        style={{ width: '100%', fontSize: '0.9rem' }}>
                        {loading ? 'Sending...' : <><FiSend size={16} /> Send Message</>}
                      </button>
                    </form>

                    {/* WhatsApp CTA */}
                    <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 mt-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'rgba(37,211,102,0.08)', border: '1.5px solid rgba(37,211,102,0.25)', color: '#16a34a' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.08)'}
                    >
                      <FaWhatsapp size={18} /> Chat on WhatsApp — instant reply
                    </a>
                  </>
                )}
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden h-full"
                style={{ minHeight: 480, boxShadow: '0 8px 32px rgba(10,25,47,0.10)' }}
              >
                <MapContainer
                  center={[19.0596, 72.8295]}
                  zoom={15}
                  style={{ height: '100%', minHeight: 480 }}
                  aria-label="TravelGo office location map"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© OpenStreetMap contributors'
                  />
                  <Marker position={[19.0596, 72.8295]}>
                    <Popup>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', padding: '4px' }}>
                        <strong style={{ color: '#0f172a' }}>TravelGo HQ</strong><br />
                        <span style={{ fontSize: 12, color: '#666' }}>123 Travel Street, Bandra West</span>
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
