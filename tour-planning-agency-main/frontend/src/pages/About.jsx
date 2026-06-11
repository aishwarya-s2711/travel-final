import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const CountUpComponent = typeof CountUp === 'function' ? CountUp : (CountUp.default || CountUp);
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const VALUES = [
  { icon: FiAward,  title: 'Excellence',  text: 'We set the highest standards in every tour we craft — from 5★ stays to certified local guides.' },
  { icon: FiHeart,  title: 'Passion',     text: 'Travel is our calling, not just our business. Every itinerary is designed with genuine love for the journey.' },
  { icon: FiUsers,  title: 'People First', text: 'Your satisfaction is our north star. We are available 24/7 because your travel experience never stops.' },
  { icon: FiGlobe,  title: 'Sustainability', text: 'We partner with eco-conscious hotels and support local communities in every destination we operate.' },
];

function StatCounter({ value, label, suffix }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-light text-white mb-2"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        {inView ? <CountUpComponent end={value} duration={2.5} separator="," suffix={suffix} /> : `0${suffix}`}
      </div>
      {/* white/80 on navy ≈ 10:1 — WCAG AA ✓ */}
      <p className="tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.8125rem' }}>{label}</p>
    </div>
  );
}

const DEFAULT_STATS = [
  { value: 50000, label: 'Happy Travelers', suffix: '+' },
  { value: 500, label: 'Tour Packages', suffix: '+' },
  { value: 80, label: 'Destinations', suffix: '+' },
  { value: 15, label: 'Years Experience', suffix: '+' },
];

const DEFAULT_TEAM = [
  { _id: '1', name: 'Alexandra Reed', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573497019940-16f81756b78e?w=500&fit=crop&q=80', bio: '15+ years luxury travel industry veteran.' },
  { _id: '2', name: 'James Wilson', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&fit=crop&q=80', bio: 'Expert in international tour logistics.' },
  { _id: '3', name: 'Priya Patel', role: 'Senior Travel Consultant', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&fit=crop&q=80', bio: 'Specialist in Asian & European packages.' },
  { _id: '4', name: 'Carlos Mendez', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&fit=crop&q=80', bio: 'Dedicated to crafting perfect journeys.' },
];

export default function About() {
  const [team, setTeam] = useState(DEFAULT_TEAM);
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    api.get('/public/team').then(r => { if (r.data?.length) setTeam(r.data); }).catch(() => {});
    api.get('/public/stats').then(r => { if (r.data?.length) setStats(r.data); }).catch(() => {});
  }, []);

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about TravelGo — India's trusted luxury travel agency since 2009. Meet our team and discover our mission to make luxury travel accessible."
        canonical="/about"
        image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85"
      />
      <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
        <PageHero
          badge="Our Story"
          title="About TravelGo"
          subtitle="Crafting extraordinary journeys since 2009"
          image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=60"
        />

        {/* Intro */}
        <section className="py-20" style={{ background: '#fff' }} aria-label="About TravelGo">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80"
                    className="w-full h-96 object-cover rounded-3xl"
                    alt="Santorini luxury travel destination"
                    loading="lazy"
                    style={{ boxShadow: '0 24px 64px rgba(10,25,47,0.14)' }}
                  />
                  <div className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-white text-center"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #d4af37)', boxShadow: '0 12px 40px rgba(124,58,237,0.40)' }}>
                    <div className="text-3xl font-light mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>15+</div>
                    <div className="text-xs tracking-widest uppercase">Years of Excellence</div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:pt-6">
                <span className="section-badge">Who We Are</span>
                <h2 className="text-4xl lg:text-5xl font-light mt-3 mb-6" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                  Your Trusted<br />Travel Partner
                </h2>
                {/* text-base = 16px body text, leading-relaxed = comfortable reading line-height */}
                <p className="text-base leading-relaxed mb-5" style={{ color: '#374151' }}>
                  TravelGo offers premium, curated travel experiences with a focus on luxury and authenticity.
                </p>
                <ul className="list-disc list-inside text-base leading-relaxed mb-8" style={{ color: '#374151' }}>
                  <li>Hand‑picked 5★ stays and exclusive itineraries</li>
                  <li>Dedicated concierge service 24/7</li>
                  <li>Commitment to sustainable, responsible travel</li>
                </ul>
                <ul className="space-y-3 mb-8" role="list">
                  {['IATA certified travel agency', 'Award-winning customer service', '500+ curated luxury packages', '50,000+ satisfied global travelers'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base" style={{ color: '#1a1a1a' }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(124,58,237,0.12)' }}>
                        <FiCheck size={11} style={{ color: '#7C3AED' }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/packages" className="btn-primary">Explore Our Packages</Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }} aria-label="TravelGo statistics">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/10">
              {stats.map((s, i) => <StatCounter key={i} {...s} />)}
            </div>
          </div>
        </section>

        {/* Vision / Mission / Values */}
        <section className="py-20" style={{ background: '#ffffff' }} aria-label="Our values">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="section-badge">Our Foundation</span>
              <h2 className="text-4xl lg:text-5xl font-light mt-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                What Drives Us
              </h2>
            </div>

            {/* VMV cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: '🔭', title: 'Our Vision',  border: '#0f172a', text: "To be the world's most loved travel company where every journey is a masterpiece and every traveler feels like royalty." },
                { icon: '🎯', title: 'Our Mission', border: '#7C3AED', text: 'To craft personalized, sustainable travel experiences that exceed expectations while supporting local communities worldwide.' },
                { icon: '💫', title: 'Our Values',  border: '#10b981', text: 'Integrity, excellence, and passion drive everything we do. Transparent pricing, authentic experiences, lifelong relationships.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: '#fff', borderTop: `4px solid ${item.border}`, boxShadow: '0 4px 24px rgba(10,25,47,0.06)' }}>
                  <div className="text-4xl mb-5">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>{item.title}</h3>
                  <p className="leading-[1.8]" style={{ color: '#374151', fontSize: '0.9375rem' }}>{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Values grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VALUES.map(({ icon: Icon, title, text }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6"
                style={{ background: '#fff', boxShadow: '0 2px 12px rgba(10,25,47,0.05)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(124,58,237,0.10)' }}>
                  <Icon size={20} style={{ color: '#7C3AED' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', fontSize: '1.1rem' }}>{title}</h3>
                {/* text-sm + #4b5563 = 7.4:1 on white — WCAG AA ✓ (was text-xs + #888 = 3.5:1, fail) */}
                <p className="leading-7" style={{ color: '#4b5563', fontSize: '0.9375rem' }}>{text}</p>
              </motion.div>
            ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20" style={{ background: '#fff' }} aria-label="Our team">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="section-badge">Our People</span>
              <h2 className="text-4xl lg:text-5xl font-light mt-3 mb-4" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
                Meet Our Team
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: '#4b5563', fontSize: '0.9375rem' }}>
                Passionate travel experts dedicated to making your dream trip a reality
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.article key={member._id || member.id || i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="rounded-2xl overflow-hidden group"
                  style={{ background: '#fff', boxShadow: '0 4px 24px rgba(10,25,47,0.07)' }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={member.image} alt={`${member.name}, ${member.role}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3"
                      style={{ background: 'rgba(10,25,47,0.65)' }}>
                      {[{ icon: '💼', label: 'LinkedIn' }, { icon: '🐦', label: 'Twitter' }, { icon: '📧', label: 'Email' }].map((s, j) => (
                        <button key={j} aria-label={s.label} className="w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all"
                          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.30)' }}>
                          {s.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-base mb-1" style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>{member.name}</h3>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#7C3AED' }}>{member.role}</p>
                    {/* text-sm + #4b5563 = 7.4:1 on white — WCAG AA ✓ (was text-xs + #888 = 3.5:1, fail) */}
                    <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>{member.bio}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
