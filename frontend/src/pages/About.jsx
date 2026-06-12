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
  { icon: FiAward,  title: 'Excellence',  text: 'Bespoke high-end itineraries, private local guides, and 5★ boutique hotels.' },
  { icon: FiHeart,  title: 'Bespoke Care', text: 'Tailoring each step to match your personal interests, speed, and comfort.' },
  { icon: FiUsers,  title: 'Private Concierge', text: 'Dedicated travel consultants on-call 24/7 during your entire voyage.' },
  { icon: FiGlobe,  title: 'Green Ethos', text: 'Eco-conscious partner properties preserving local heritages and economies.' },
];

function StatCounter({ value, label, suffix }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <div ref={ref} className="text-center py-6">
      <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        {inView ? <CountUpComponent end={value} duration={2.5} separator="," suffix={suffix} /> : `0${suffix}`}
      </div>
      <p className="tracking-widest uppercase text-slate-300 text-sm font-bold mt-2">{label}</p>
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
  { _id: '1', name: 'Alexandra Reed', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573497019940-16f81756b78e?w=500&fit=crop&q=80', bio: '15+ years luxury travel veteran.' },
  { _id: '2', name: 'James Wilson', role: 'Operations Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&fit=crop&q=80', bio: 'Specialist in custom tour operations.' },
  { _id: '3', name: 'Priya Patel', role: 'Lead Consultant', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&fit=crop&q=80', bio: 'Expert in Euro-Asian packages.' },
  { _id: ' Carlos Mendez', role: 'Guest Relations Manager', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&fit=crop&q=80', bio: 'Committed to seamless guest trips.' },
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
        title="About Us — TravelGo Tour Planning Agency"
        description="Discover the story behind TravelGo. Handcrafting premium and luxury travel itineraries for global guests since 2009."
        canonical="/about"
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Page Hero */}
        <PageHero
          badge="Bespoke Planners"
          title="About TravelGo"
          subtitle="Crafting extraordinary personal journeys since 2009"
          image="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1400&q=60"
        />

        {/* Section 1: Intro Story */}
        <section className="py-28 bg-white dark:bg-slate-900 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80"
                    className="w-full h-[380px] object-cover rounded-[20px] shadow-md"
                    alt="Travel destination preview"
                    loading="lazy"
                  />
                  
                  <div className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-white text-center bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl border border-blue-500/20">
                    <div className="text-3xl font-extrabold mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>15+</div>
                    <div className="text-sm tracking-widest uppercase font-bold text-blue-100 mt-1">Years of luxury care</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="section-badge">Our Journey</span>
                <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6">
                  Your Trusted Travel Partner
                </h2>
                <div className="space-y-4">
                  <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    We design personalized itineraries, securing boutique villas, private local guides, and custom flight paths to let you travel with complete peace of mind. Our team meticulously plans every detail so you can focus on making memories.
                  </p>
                  <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    With over a decade of experience, we have cultivated exclusive relationships with top-tier hospitality brands across the globe, ensuring VIP treatment wherever you go.
                  </p>
                </div>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-6">
                  {[
                    'IATA-certified specialists', 
                    '24/7 dedicated concierge desk', 
                    '500+ curated 5★ locations', 
                    '50k+ guest trips completed'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-base text-slate-800 dark:text-slate-200 font-semibold">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-900/50">
                        <FiCheck size={16} className="text-blue-600 dark:text-blue-400" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/packages" className="btn-premium py-4 px-8 text-sm font-bold uppercase tracking-wider inline-block">
                  Explore Itineraries
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Section 2: Stats Banner */}
        <section className="py-24 bg-gradient-to-r from-slate-950 via-blue-955 to-slate-955 border-y border-blue-900/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {stats.map((s, i) => <StatCounter key={i} {...s} />)}
            </div>
          </div>
        </section>

        {/* Section 3: Vision / Mission / Values */}
        <section className="py-28 bg-white dark:bg-slate-900 transition-colors">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16 space-y-3">
              <span className="section-badge mx-auto">Core Foundations</span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                What Guides Our Agency
              </h2>
            </div>

            {/* VMV Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                { icon: '🔭', title: 'Our Vision',  border: '#2563EB', text: "To define the art of bespoke luxury vacations, where every tour is a tailored masterpiece." },
                { icon: '🎯', title: 'Our Mission', border: '#1e40af', text: "To deliver elite, sustainable, and stress-free guest plans that surpass expectations." },
                { icon: '💎', title: 'Our Ethics',  border: '#60a5fa', text: "Total pricing transparency, handpicked luxury stays, and certified local host partners." },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-[20px] p-8 text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm"
                  style={{ borderTop: `4px solid ${item.border}` }}
                >
                  <div className="text-4xl mb-5">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                  <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Core Values details */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map(({ icon: Icon, title, text }, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.08 }}
                  className="rounded-[20px] p-6 bg-white dark:bg-slate-905 border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-blue-50 dark:bg-blue-950/45">
                    <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                  <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* Section 4: Elite Team */}
        <section className="py-28 bg-slate-50 dark:bg-slate-950/30 transition-colors border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16 space-y-3">
              <span className="section-badge mx-auto">Concierge Specialists</span>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Meet Our Experts
              </h2>
              <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mt-4">
                Bespoke travel consultants dedicated to orchestrating your seamless itineraries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <motion.article 
                  key={member._id || member.id || i}
                  initial={{ opacity: 0, y: 15 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="premium-card group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
                >
                  <div className="relative h-56 overflow-hidden card-image-wrap">
                    <img 
                      src={member.image} 
                      alt={`${member.name}, ${member.role}`}
                      className="w-full h-full object-cover"
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 bg-slate-950/60 backdrop-blur-xs">
                      {['💼', '📧'].map((s, j) => (
                        <button key={j} className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-xl mb-1 text-slate-900 dark:text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{member.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 text-blue-600 dark:text-blue-400">{member.role}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{member.bio}</p>
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
