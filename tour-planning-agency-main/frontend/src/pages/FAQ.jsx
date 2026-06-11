import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'Booking & Reservations',
    items: [
      { q: 'How do I book a tour package?', a: 'Browse our packages, select your preferred tour, click "Book Now", fill in your traveler details, choose your travel date, and complete the payment. You\'ll receive a confirmation email within 24 hours with all your booking details.' },
      { q: 'Can I book a custom or private tour?', a: 'Absolutely! Contact our travel consultants via the Contact page or WhatsApp and we\'ll design a fully personalized itinerary based on your preferences, dates, group size, and budget. Custom tours usually take 48–72 hours to design.' },
      { q: 'How far in advance should I book?', a: 'We recommend booking at least 4–8 weeks in advance for international packages and 2–4 weeks for domestic packages, especially during peak season (October–March). For honeymoon and group packages, 3–6 months is ideal.' },
      { q: 'Is my booking confirmed immediately?', a: 'Most bookings are confirmed within 24 hours. For certain exclusive properties or peak season dates, confirmation may take up to 48 hours. You\'ll receive an email with status updates at every step.' },
    ],
  },
  {
    category: 'Payments & Pricing',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, net banking, and EMI options through our secure payment gateway. International cards are accepted for all packages.' },
      { q: 'Do you offer a price-match guarantee?', a: 'Yes! If you find the same package at a lower price on another platform within 7 days of booking, we\'ll match the price and refund the difference. Terms and conditions apply.' },
      { q: 'Are there any hidden fees?', a: 'Never. All prices are fully transparent. What you see on the package detail page is exactly what you pay. Taxes, service fees, and applicable surcharges are shown before payment.' },
      { q: 'Can I pay in installments?', a: 'Yes, we offer flexible EMI plans for packages above ₹50,000. You can choose 3, 6, or 12-month EMI plans with 0% interest on select credit cards.' },
    ],
  },
  {
    category: 'Cancellations & Refunds',
    items: [
      { q: 'What is your cancellation policy?', a: 'Our standard policy: 30+ days before travel: 90% refund. 15–29 days: 60% refund. 7–14 days: 30% refund. Under 7 days: no refund. Some packages have specific policies — always check the package detail page.' },
      { q: 'What if TravelGo cancels my trip?', a: 'In the rare event we cancel your trip due to circumstances beyond our control (natural disasters, government advisories), you receive a full 100% refund or free rescheduling to an alternate date of your choice.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 7–10 business days to your original payment method. Bank processing times may add 3–5 additional business days depending on your bank.' },
    ],
  },
  {
    category: 'Visas & Documentation',
    items: [
      { q: 'Do you assist with visa applications?', a: 'Yes, we provide comprehensive visa assistance including document checklists, application guidance, and coordination with consulates for all destinations we operate in. Visa fees are charged separately.' },
      { q: 'What documents do I need for international travel?', a: 'A valid passport (minimum 6 months validity beyond your return date), visa, travel insurance, and any destination-specific health documentation. We\'ll provide a full checklist upon booking.' },
      { q: 'Is travel insurance mandatory?', a: 'It\'s not mandatory but strongly recommended for all international packages. We offer premium travel insurance through our partners covering medical emergencies, trip cancellations, and baggage loss.' },
    ],
  },
  {
    category: 'During Your Trip',
    items: [
      { q: 'What is your 24/7 support number?', a: 'Our concierge team is available 24/7 at +91 98765 43210 (WhatsApp & call). You can also reach us via email at concierge@travelgo.com. Response time is under 30 minutes during business hours.' },
      { q: 'What if something goes wrong during my trip?', a: 'Our on-ground team and local guides are trained to handle any situation. Contact our 24/7 emergency line immediately. We have partnerships with local hospitals, embassies, and service providers in all destinations.' },
      { q: 'Are your guides certified?', a: 'All our local guides are government-certified, background-checked, and have minimum 5 years of experience. They are fluent in English and the local language, and carry emergency contact protocols.' },
    ],
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${index}`;
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <span className="text-base font-semibold pr-4" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0f172a' }}>
          {item.q}
        </span>
        <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: open ? '#0f172a' : 'rgba(124,58,237,0.10)', color: open ? '#7C3AED' : '#0f172a' }}>
          {open ? <FiMinus size={15} /> : <FiPlus size={15} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6">
              <div className="h-px mb-4" style={{ background: 'rgba(124,58,237,0.20)' }} />
              <p className="text-base leading-[1.85]" style={{ color: '#374151' }}>{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...FAQ_DATA.map(f => f.category)];
  const filtered = activeCategory === 'All' ? FAQ_DATA : FAQ_DATA.filter(f => f.category === activeCategory);

  return (
    <>
      <SEO
        title="FAQ — Frequently Asked Questions"
        description="Find answers to common questions about booking, payments, cancellations, visas, and travel support at TravelGo."
        canonical="/faq"
      />

      <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
        <PageHero
          badge="Help Centre"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about traveling with TravelGo"
          image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=60"
        />

        <section className="py-20" style={{ background: '#ffffff' }} aria-label="FAQ content">
          <div className="max-w-4xl mx-auto px-6">

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className="px-5 py-2.5 rounded-full text-[0.8125rem] font-bold tracking-widest uppercase transition-all"
                  style={{
                    background: activeCategory === c ? '#0f172a' : 'transparent',
                    color: activeCategory === c ? '#fff' : '#374151',
                    border: `1.5px solid ${activeCategory === c ? '#0f172a' : '#e8e4dc'}`,
                    letterSpacing: '1.5px',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Accordion Groups */}
            <div className="space-y-12">
              {filtered.map((group, gi) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.08 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 rounded-full" style={{ background: '#7C3AED' }} />
                    <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                      {group.category}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item, i) => (
                      <FAQItem key={i} item={item} index={`${gi}-${i}`} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 rounded-3xl p-12 text-center"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}
            >
              <p className="label-text justify-center mb-4" style={{ color: '#7C3AED' }}>Still Have Questions?</p>
              <h3 className="text-4xl font-light text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                We're Here to Help
              </h3>
              <p className="mb-8" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                Our concierge team is available Mon–Sat, 9AM–7PM IST
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact" className="btn-luxury">Contact Us</Link>
                <a
                  href="https://wa.me/911234567890"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
