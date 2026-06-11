import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';

const SECTIONS = [
  { id: 'information', title: 'Information We Collect' },
  { id: 'use', title: 'How We Use Your Information' },
  { id: 'sharing', title: 'Information Sharing' },
  { id: 'cookies', title: 'Cookies & Tracking' },
  { id: 'security', title: 'Data Security' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'changes', title: 'Policy Changes' },
  { id: 'contact', title: 'Contact Us' },
];

/* ── Inline styles (scoped to this page) ── */
const s = {
  body: {
    fontSize: '1rem',
    lineHeight: '1.85',
    color: '#374151',
    maxWidth: '100%',
  },
  sectionHeading: {
    fontFamily: 'Inter, sans-serif',
    color: '#0f172a',
    fontSize: '1.625rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e8e4dc',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  },
  sectionNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    background: 'rgba(124,58,237,0.10)',
    border: '1px solid rgba(124,58,237,0.25)',
    color: '#7C3AED',
    fontSize: '0.8125rem',
    fontWeight: 700,
    fontFamily: 'DM Sans, sans-serif',
    flexShrink: 0,
  },
  subHeading: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: 'DM Sans, sans-serif',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    letterSpacing: '0.01em',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0.75rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#374151',
  },
  listBullet: {
    flexShrink: 0,
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
    marginTop: '0.55rem',
  },
  callout: {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(248,246,242,0.8) 100%)',
    borderLeft: '4px solid #7C3AED',
    borderRadius: '0 12px 12px 0',
    padding: '1.25rem 1.5rem',
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#374151',
    marginBottom: '2.5rem',
  },
  tocContainer: {
    background: '#fff',
    boxShadow: '0 4px 24px rgba(10,25,47,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid rgba(232,228,220,0.6)',
  },
  tocTitle: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#7C3AED',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e8e4dc',
  },
  tocLink: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    color: isActive ? '#0f172a' : '#6b7280',
    background: isActive ? 'rgba(124,58,237,0.08)' : 'transparent',
    fontWeight: isActive ? 600 : 400,
    borderLeft: isActive ? '2.5px solid #7C3AED' : '2.5px solid transparent',
    transition: 'all 0.25s ease',
    lineHeight: 1.4,
  }),
  tocNumber: (isActive) => ({
    fontSize: '0.6875rem',
    fontWeight: 700,
    color: isActive ? '#7C3AED' : '#9ca3af',
    fontFamily: 'DM Sans, sans-serif',
    minWidth: '1.125rem',
    transition: 'color 0.25s ease',
  }),
  articleCard: {
    background: '#fff',
    boxShadow: '0 4px 24px rgba(10,25,47,0.06)',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 3vw, 3rem)',
    border: '1px solid rgba(232,228,220,0.6)',
  },
  /* ── Table ── */
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e8e4dc',
    marginTop: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.9375rem',
  },
  th: {
    background: '#0f172a',
    color: '#2563EB',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '0.75rem 1rem',
    textAlign: 'left',
  },
  td: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f0ede6',
    color: '#374151',
    lineHeight: 1.6,
  },
  trEven: {
    background: '#faf9f7',
  },
  /* ── Rights card ── */
  rightCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(248,246,242,0.7)',
    border: '1px solid #e8e4dc',
    marginBottom: '0.5rem',
    transition: 'all 0.3s ease',
  },
  rightIcon: {
    flexShrink: 0,
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(124,58,237,0.04))',
    border: '1px solid rgba(124,58,237,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  },
  /* ── Security feature card ── */
  securityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  securityCard: {
    padding: '1rem 1.125rem',
    borderRadius: '12px',
    background: 'rgba(248,246,242,0.7)',
    border: '1px solid #e8e4dc',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
  },
  securityIcon: {
    flexShrink: 0,
    width: '2rem',
    height: '2rem',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  /* ── Info box (children, disclaimer) ── */
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1rem',
    lineHeight: 1.8,
  },
  /* ── Contact grid ── */
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  contactCard: {
    padding: '1.25rem',
    borderRadius: '12px',
    background: '#f8f6f2',
    border: '1px solid #e8e4dc',
    transition: 'all 0.3s ease',
  },
  contactLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#7C3AED',
    fontFamily: 'DM Sans, sans-serif',
    marginBottom: '0.375rem',
  },
  contactValue: {
    fontSize: '0.9375rem',
    color: '#0f172a',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  /* ── Recommendation / tip ── */
  recommendation: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(16,185,129,0.05)',
    border: '1px solid rgba(16,185,129,0.18)',
    marginTop: '1.25rem',
    fontSize: '0.9375rem',
    lineHeight: 1.7,
    color: '#065f46',
  },
};

/* ── Helper: bullet list ── */
function BulletList({ items }) {
  return (
    <ul style={s.list}>
      {items.map((item, i) => (
        <li key={i} style={s.listItem}>
          <span style={s.listBullet} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Section content renderer ── */
function SectionContent({ id }) {
  switch (id) {
    case 'information':
      return (
        <>
          <h3 style={s.subHeading}>Directly Provided</h3>
          <p style={s.body}>We collect information you provide directly, such as:</p>
          <BulletList items={[
            'Personal identification (name, email address, phone number, date of birth)',
            'Payment information (processed securely through PCI-DSS compliant gateways — we never store card details)',
            'Travel preferences, passport details, and visa information for booking purposes',
            'Communication records when you contact our support team',
            'Profile information when you create an account',
          ]} />

          <h3 style={s.subHeading}>Automatically Collected</h3>
          <p style={s.body}>We also collect certain data automatically when you use our services:</p>
          <BulletList items={[
            'Device and browser information, IP address, and operating system',
            'Pages visited, links clicked, and time spent on our website',
            'Booking and search history to personalize your experience',
          ]} />
        </>
      );

    case 'use':
      return (
        <>
          <p style={s.body}>We use your information to:</p>
          <BulletList items={[
            'Process and confirm tour bookings and payments',
            'Provide customer support and respond to inquiries',
            'Send booking confirmations, travel documents, and updates',
            'Personalize your experience and recommend relevant packages',
            <>Send promotional offers and newsletters <span style={{ color: '#4b5563', fontStyle: 'italic' }}>(with your consent — you can unsubscribe anytime)</span></>,
            'Improve our website, products, and services',
            'Comply with legal obligations and prevent fraud',
          ]} />
        </>
      );

    case 'sharing':
      return (
        <>
          <p style={{ ...s.body, padding: '0.875rem 1.125rem', borderRadius: '10px', background: 'rgba(248,246,242,0.7)', border: '1px solid #e8e4dc', fontWeight: 500 }}>
            🔒 We do <strong>not</strong> sell or rent your personal information.
          </p>
          <p style={{ ...s.body, marginTop: '1rem' }}>We share data only with:</p>
          <BulletList items={[
            'Travel service providers (hotels, airlines, tour operators) necessary to fulfill your booking',
            'Payment processors for secure transaction handling',
            'Government authorities when required by law',
            'Analytics providers (data anonymized) to improve our services',
          ]} />
          <p style={{ ...s.body, marginTop: '1rem', fontStyle: 'italic', color: '#4b5563' }}>
            All third parties are contractually bound to maintain confidentiality and cannot use your data for their own marketing purposes.
          </p>
        </>
      );

    case 'cookies':
      return (
        <>
          <p style={s.body}>We use cookies and similar technologies to:</p>
          <BulletList items={[
            'Keep you logged in and remember preferences',
            'Analyze website traffic and performance (Google Analytics, anonymized)',
            'Enable social media sharing features',
            'Deliver relevant advertising (you can opt out at any time)',
          ]} />
          <div style={{ ...s.recommendation, background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)', color: '#374151' }}>
            <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '0.15rem' }}>⚙️</span>
            <span>
              You can control cookies through your browser settings. Disabling essential cookies may affect website functionality. Visit our <strong>Cookie Settings</strong> page to manage your preferences.
            </span>
          </div>
        </>
      );

    case 'security':
      return (
        <>
          <p style={s.body}>We implement industry-standard security measures to protect your data:</p>
          <div style={s.securityGrid}>
            {[
              { icon: '🔐', label: 'SSL/TLS Encryption', desc: 'All data transmission is encrypted' },
              { icon: '💳', label: 'PCI-DSS Compliant', desc: 'Secure payment processing' },
              { icon: '🛡️', label: 'Security Audits', desc: 'Regular penetration testing' },
              { icon: '🔑', label: 'Two-Factor Auth', desc: 'For all admin accounts' },
              { icon: '🗄️', label: 'Encrypted Storage', desc: 'Sensitive data at rest' },
            ].map((item, i) => (
              <div key={i} style={s.securityCard}>
                <span style={s.securityIcon}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...s.body, marginTop: '1.25rem', fontStyle: 'italic', color: '#4b5563', fontSize: '0.9375rem' }}>
            No method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
          </p>
        </>
      );

    case 'rights':
      return (
        <>
          <p style={s.body}>
            Under GDPR and applicable data protection laws, you have the following rights:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
            {[
              { icon: '📋', title: 'Access', desc: 'Request a copy of all personal data we hold about you' },
              { icon: '✏️', title: 'Rectification', desc: 'Correct any inaccurate or incomplete data' },
              { icon: '🗑️', title: 'Erasure', desc: 'Request deletion of your data ("right to be forgotten")' },
              { icon: '📦', title: 'Portability', desc: 'Receive your data in a structured, machine-readable format' },
              { icon: '🚫', title: 'Objection', desc: 'Object to processing of your data for marketing purposes' },
              { icon: '↩️', title: 'Withdrawal', desc: 'Withdraw consent at any time' },
            ].map((right, i) => (
              <div key={i} style={s.rightCard}>
                <span style={s.rightIcon}>{right.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem', marginBottom: '0.125rem' }}>{right.title}</div>
                  <div style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6 }}>{right.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={s.recommendation}>
            <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '0.15rem' }}>📧</span>
            <span>
              To exercise these rights, email <a href="mailto:privacy@travelgo.com" style={{ color: '#065f46', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>privacy@travelgo.com</a>. We will respond within <strong>30 days</strong>.
            </span>
          </div>
        </>
      );

    case 'retention':
      return (
        <>
          <p style={s.body}>We retain your data for as long as necessary to fulfill the purposes described:</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Data Type</th>
                <th style={s.th}>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Active account data', 'Duration of account + 3 years'],
                ['Booking records', '7 years (legal & tax compliance)'],
                ['Marketing data', 'Until you unsubscribe or request deletion'],
                ['Support communications', '2 years'],
              ].map(([type, period], i) => (
                <tr key={i} style={i % 2 === 1 ? s.trEven : {}}>
                  <td style={{ ...s.td, fontWeight: 500, color: '#0f172a' }}>{type}</td>
                  <td style={s.td}>{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ ...s.body, marginTop: '0.75rem', fontSize: '0.9375rem', color: '#4b5563' }}>
            When data is no longer needed, it is securely deleted or anonymized.
          </p>
        </>
      );

    case 'children':
      return (
        <div style={{ ...s.infoBox, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', color: '#92400e' }}>
          <span style={{ fontSize: '1.25rem', lineHeight: 1, marginTop: '0.15rem', flexShrink: 0 }}>👶</span>
          <div>
            <p style={{ margin: 0, lineHeight: 1.8 }}>
              Our services are <strong>not directed to children under 18</strong>. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal information, please contact us immediately at{' '}
              <a href="mailto:privacy@travelgo.com" style={{ color: '#92400e', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                privacy@travelgo.com
              </a>{' '}
              and we will delete such information promptly.
            </p>
          </div>
        </div>
      );

    case 'changes':
      return (
        <p style={s.body}>
          We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a prominent notice on our website at least <strong>30 days</strong> before they take effect. Continued use of our services after changes constitutes acceptance of the updated policy.
        </p>
      );

    case 'contact':
      return (
        <>
          <p style={s.body}>
            For privacy-related questions or to exercise your data rights:
          </p>
          <div style={s.contactGrid}>
            <div style={s.contactCard}>
              <div style={s.contactLabel}>Email</div>
              <div style={s.contactValue}>
                <a href="mailto:privacy@travelgo.com" style={{ color: '#0f172a', textDecoration: 'underline', textDecorationColor: '#7C3AED', textUnderlineOffset: '3px' }}>
                  privacy@travelgo.com
                </a>
              </div>
            </div>
            <div style={s.contactCard}>
              <div style={s.contactLabel}>Post</div>
              <div style={s.contactValue}>
                Data Protection Officer<br />
                TravelGo, 123 Travel Street<br />
                Bandra West, Mumbai 400050, India
              </div>
            </div>
            <div style={s.contactCard}>
              <div style={s.contactLabel}>Phone</div>
              <div style={s.contactValue}>+91 12345 67890</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Mon–Sat, 9 AM – 6 PM IST</div>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.875rem 1.125rem', borderRadius: '10px', background: 'rgba(248,246,242,0.7)', border: '1px solid #e8e4dc', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.7 }}>
            <strong style={{ color: '#0f172a' }}>Response times:</strong> Within 3 business days for general inquiries · Within 30 days for formal data requests.
          </div>
        </>
      );

    default:
      return null;
  }
}

export default function Privacy() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how TravelGo collects, uses, and protects your personal information. Your privacy and data security are our top priority."
        canonical="/privacy"
      />
      <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
        <PageHero
          badge="Legal"
          title="Privacy Policy"
          subtitle="Last updated: January 1, 2025"
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=50"
        />

        <section className="py-16" style={{ background: '#ffffff' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-12">

              {/* ── Sticky TOC ── */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-28" style={s.tocContainer}>
                  <p style={s.tocTitle}>Table of Contents</p>
                  <nav aria-label="Privacy policy sections">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {SECTIONS.map((sec, i) => (
                        <li key={sec.id}>
                          <a
                            href={`#${sec.id}`}
                            style={s.tocLink(active === sec.id)}
                            onMouseEnter={e => {
                              if (active !== sec.id) {
                                e.currentTarget.style.color = '#0f172a';
                                e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (active !== sec.id) {
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <span style={s.tocNumber(active === sec.id)}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {sec.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>

              {/* ── Content ── */}
              <article className="flex-1 min-w-0">
                <div style={s.articleCard}>

                  {/* Intro callout */}
                  <div style={s.callout}>
                    <p style={{ margin: 0 }}>
                      At TravelGo <strong>("we", "us", "our")</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                  </div>

                  {/* Sections */}
                  {SECTIONS.map((section, index) => (
                    <section key={section.id} id={section.id} className="scroll-mt-28" style={{ marginBottom: '2.5rem' }}>
                      <h2 style={s.sectionHeading}>
                        <span style={s.sectionNumber}>{index + 1}</span>
                        {section.title}
                      </h2>
                      <SectionContent id={section.id} />
                    </section>
                  ))}

                  {/* Back to top */}
                  <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #e8e4dc' }}>
                    <a
                      href="#information"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#7C3AED',
                        textDecoration: 'none',
                        letterSpacing: '0.5px',
                        fontFamily: 'DM Sans, sans-serif',
                        transition: 'color 0.25s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#7C3AED'}
                    >
                      ↑ Back to Top
                    </a>
                  </div>

                </div>
              </article>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
