import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance of Terms', icon: '§' },
  { id: 'services', title: 'Our Services', icon: '§' },
  { id: 'bookings', title: 'Bookings & Payments', icon: '§' },
  { id: 'cancellation', title: 'Cancellations & Refunds', icon: '§' },
  { id: 'conduct', title: 'Traveler Conduct', icon: '§' },
  { id: 'liability', title: 'Limitation of Liability', icon: '§' },
  { id: 'ip', title: 'Intellectual Property', icon: '§' },
  { id: 'disputes', title: 'Disputes & Governing Law', icon: '§' },
  { id: 'modifications', title: 'Modifications', icon: '§' },
  { id: 'contact', title: 'Contact Information', icon: '§' },
];

/* ── Inline styles (scoped to this page) ── */
const styles = {
  /* ── Content typography ── */
  body: {
    fontSize: '1rem',
    lineHeight: '1.85',
    color: '#374151',
    maxWidth: '100%',
  },
  /* ── Section heading ── */
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
  /* ── Sub-headings inside sections ── */
  subHeading: {
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: 'DM Sans, sans-serif',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    letterSpacing: '0.01em',
  },
  /* ── Bullet list ── */
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
  /* ── Numbered steps ── */
  stepCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(248,246,242,0.7)',
    border: '1px solid #e8e4dc',
    marginBottom: '0.625rem',
    transition: 'all 0.3s ease',
  },
  stepNumber: {
    flexShrink: 0,
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    fontFamily: 'DM Sans, sans-serif',
  },
  /* ── Callout / highlight box ── */
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
  /* ── Contact card ── */
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
  /* ── TOC ── */
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
  /* ── Article card ── */
  articleCard: {
    background: '#fff',
    boxShadow: '0 4px 24px rgba(10,25,47,0.06)',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 3vw, 3rem)',
    border: '1px solid rgba(232,228,220,0.6)',
  },
  /* ── Recommendation box ── */
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
  /* ── Refund table ── */
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
};

/* ── Helper: render a bullet list ── */
function BulletList({ items }) {
  return (
    <ul style={styles.list}>
      {items.map((item, i) => (
        <li key={i} style={styles.listItem}>
          <span style={styles.listBullet} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Helper: render numbered steps ── */
function NumberedSteps({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
      {steps.map((step, i) => (
        <div key={i} style={styles.stepCard}>
          <span style={styles.stepNumber}>{i + 1}</span>
          <span style={{ ...styles.body, marginTop: '0.1rem' }}>{step}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main section content renderer ── */
function SectionContent({ id }) {
  switch (id) {
    case 'acceptance':
      return (
        <>
          <p style={styles.body}>
            By using TravelGo's website, mobile application, or any of our services, you confirm that:
          </p>
          <BulletList items={[
            'You are at least 18 years of age or have parental/guardian consent',
            'You have the legal capacity to enter into binding contracts',
            'All information you provide is accurate and complete',
            'You will comply with all applicable laws and regulations',
          ]} />
          <p style={{ ...styles.body, marginTop: '1rem', padding: '0.875rem 1.125rem', borderRadius: '10px', background: 'rgba(248,246,242,0.7)', border: '1px solid #e8e4dc' }}>
            These Terms constitute a legally binding agreement between you <strong>("traveler", "user")</strong> and <strong>TravelGo Travel Pvt. Ltd.</strong> <strong>("TravelGo", "company")</strong>.
          </p>
        </>
      );

    case 'services':
      return (
        <>
          <p style={styles.body}>
            TravelGo provides travel-related services including:
          </p>
          <BulletList items={[
            'Tour package bookings (international and domestic)',
            'Hotel and accommodation reservations',
            'Flight and transport coordination',
            'Visa and travel documentation assistance',
            'Custom itinerary planning and travel consulting',
            'Travel insurance facilitation',
          ]} />
          <p style={{ ...styles.body, marginTop: '1.25rem', fontStyle: 'italic', color: '#4b5563' }}>
            We act as an intermediary between travelers and service providers (airlines, hotels, tour operators). While we carefully vet all partners, we are not directly responsible for third-party service failures beyond our reasonable control.
          </p>
        </>
      );

    case 'bookings':
      return (
        <>
          <h3 style={styles.subHeading}>Booking Confirmation</h3>
          <p style={styles.body}>
            A booking is confirmed only upon receipt of full or partial payment as specified. Confirmation emails are sent within 24 hours.
          </p>

          <h3 style={styles.subHeading}>Pricing</h3>
          <p style={styles.body}>
            All prices are in Indian Rupees (INR) or US Dollars (USD) as displayed. Prices are subject to change until payment is received. We reserve the right to correct pricing errors.
          </p>

          <h3 style={styles.subHeading}>Payment Terms</h3>
          <BulletList items={[
            'A deposit of 25–50% is required to secure bookings',
            'Full payment is due 30 days before departure',
            'Last-minute bookings (within 14 days) require full payment',
            'Returned/failed payments may incur a processing fee',
          ]} />
          <p style={{ ...styles.body, marginTop: '0.75rem' }}>
            GST and applicable taxes are included in the displayed price unless stated otherwise.
          </p>
        </>
      );

    case 'cancellation':
      return (
        <>
          <h3 style={styles.subHeading}>Traveler-Initiated Cancellations</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Timeframe</th>
                <th style={styles.th}>Refund</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['30+ days before departure', '90% refund'],
                ['15–29 days before departure', '60% refund'],
                ['7–14 days before departure', '30% refund'],
                ['Less than 7 days', 'No refund'],
              ].map(([time, refund], i) => (
                <tr key={i} style={i % 2 === 1 ? styles.trEven : {}}>
                  <td style={styles.td}>{time}</td>
                  <td style={{ ...styles.td, fontWeight: 600, color: '#0f172a' }}>{refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ ...styles.body, marginTop: '0.5rem', fontSize: '0.9375rem', color: '#4b5563' }}>
            Some packages (honeymoon suites, exclusive resorts, group tours) may have stricter policies. These are clearly marked on the package detail page.
          </p>

          <h3 style={styles.subHeading}>TravelGo-Initiated Cancellations</h3>
          <BulletList items={[
            'If we cancel due to reasons within our control: 100% refund',
            'For force majeure events (natural disasters, government travel bans, pandemics): full credit note or rescheduling',
          ]} />

          <h3 style={styles.subHeading}>Refund Processing</h3>
          <p style={styles.body}>
            Refunds are processed to the original payment method within <strong>7–10 business days</strong>.
          </p>
        </>
      );

    case 'conduct':
      return (
        <>
          <p style={styles.body}>
            By booking with TravelGo, you agree to:
          </p>
          <BulletList items={[
            'Behave respectfully towards guides, hotel staff, and other travelers',
            'Comply with local laws and customs of all destinations visited',
            'Not engage in illegal activities during your tour',
            'Carry all required travel documents',
            'Inform us of any special needs, medical conditions, or dietary requirements at the time of booking',
            'Arrive punctually for all scheduled activities',
          ]} />
          <div style={{ ...styles.recommendation, marginTop: '1.25rem', background: 'rgba(220,38,38,0.04)', borderColor: 'rgba(220,38,38,0.15)', color: '#991b1b' }}>
            <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '0.15rem' }}>⚠</span>
            <span>
              We reserve the right to remove travelers from tours <strong>without refund</strong> if conduct is deemed harmful, illegal, or disruptive to others.
            </span>
          </div>
        </>
      );

    case 'liability':
      return (
        <>
          <p style={styles.body}>
            To the maximum extent permitted by law:
          </p>
          <BulletList items={[
            "TravelGo's total liability shall not exceed the total amount paid for the specific booking giving rise to the claim",
            'We are not liable for indirect, incidental, or consequential damages',
            'We are not responsible for loss caused by third-party service providers, natural events, government actions, or circumstances beyond our reasonable control',
            'Travel delays, missed connections, and force majeure events are excluded from liability',
          ]} />
          <div style={styles.recommendation}>
            <span style={{ fontSize: '1.125rem', lineHeight: 1, marginTop: '0.15rem' }}>💡</span>
            <span>
              We <strong>strongly recommend</strong> purchasing comprehensive travel insurance to cover unforeseen circumstances.
            </span>
          </div>
        </>
      );

    case 'ip':
      return (
        <>
          <p style={styles.body}>
            All content on the TravelGo website — including text, graphics, logos, images, videos, itineraries, and software — is the exclusive property of <strong>TravelGo Travel Pvt. Ltd.</strong> and is protected by copyright and trademark laws.
          </p>
          <p style={{ ...styles.body, marginTop: '1rem' }}>
            You may not reproduce, distribute, modify, or commercially exploit any content without express written permission. Personal, non-commercial use with attribution is permitted.
          </p>
        </>
      );

    case 'disputes':
      return (
        <>
          <p style={styles.body}>
            These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of our services shall be:
          </p>
          <NumberedSteps steps={[
            'First resolved through good-faith negotiation (30-day resolution period)',
            'If unresolved, submitted to mediation under the Indian Mediation and Conciliation Rules',
            'If mediation fails, subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra',
          ]} />
          <p style={{ ...styles.body, marginTop: '1rem', fontSize: '0.9375rem', color: '#4b5563' }}>
            For consumer disputes below ₹50,000, you may use the Online Consumer Dispute Redressal platform (<a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>consumerhelpline.gov.in</a>).
          </p>
        </>
      );

    case 'modifications':
      return (
        <p style={styles.body}>
          TravelGo reserves the right to modify these Terms at any time. Material changes will be communicated via email and a prominent website notice at least <strong>30 days</strong> before taking effect. Continued use of our services after the effective date constitutes acceptance of the revised Terms. We recommend reviewing this page periodically.
        </p>
      );

    case 'contact':
      return (
        <>
          <p style={styles.body}>
            For questions about these Terms, reach out through any of the channels below:
          </p>
          <div style={styles.contactGrid}>
            <div style={styles.contactCard}>
              <div style={styles.contactLabel}>Address</div>
              <div style={styles.contactValue}>
                TravelGo Travel Pvt. Ltd.<br />
                123 Travel Street, Bandra West<br />
                Mumbai 400050, Maharashtra, India
              </div>
            </div>
            <div style={styles.contactCard}>
              <div style={styles.contactLabel}>Email</div>
              <div style={styles.contactValue}>
                <a href="mailto:legal@travelgo.com" style={{ color: '#0f172a', textDecoration: 'underline', textDecorationColor: '#7C3AED', textUnderlineOffset: '3px' }}>
                  legal@travelgo.com
                </a>
              </div>
              <div style={{ ...styles.contactLabel, marginTop: '1rem' }}>Phone</div>
              <div style={styles.contactValue}>+91 12345 67890</div>
            </div>
            <div style={styles.contactCard}>
              <div style={styles.contactLabel}>Hours</div>
              <div style={styles.contactValue}>Monday–Saturday<br />9 AM – 6 PM IST</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.25rem', fontSize: '0.8125rem', color: '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>
            <span><strong style={{ color: '#374151' }}>CIN:</strong> U63040MH2009PTC123456</span>
            <span><strong style={{ color: '#374151' }}>GST:</strong> 27AABCT1234A1ZV</span>
          </div>
        </>
      );

    default:
      return null;
  }
}

export default function Terms() {
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
        title="Terms & Conditions"
        description="Read TravelGo's Terms and Conditions governing the use of our travel booking services, cancellation policies, and traveler responsibilities."
        canonical="/terms"
      />
      <div className="min-h-screen page-enter" style={{ background: '#ffffff' }}>
        <PageHero
          badge="Legal"
          title="Terms & Conditions"
          subtitle="Last updated: January 1, 2025 · Effective immediately"
          image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=50"
        />

        <section className="py-16" style={{ background: '#ffffff' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex gap-12">

              {/* ── Sticky TOC ── */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-28" style={styles.tocContainer}>
                  <p style={styles.tocTitle}>Table of Contents</p>
                  <nav aria-label="Terms sections">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {SECTIONS.map((s, i) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            style={styles.tocLink(active === s.id)}
                            onMouseEnter={e => {
                              if (active !== s.id) {
                                e.currentTarget.style.color = '#0f172a';
                                e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (active !== s.id) {
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <span style={styles.tocNumber(active === s.id)}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>

              {/* ── Content ── */}
              <article className="flex-1 min-w-0">
                <div style={styles.articleCard}>

                  {/* Intro callout */}
                  <div style={styles.callout}>
                    <p style={{ margin: 0 }}>
                      Please read these Terms and Conditions carefully before using TravelGo's services. By accessing our website or making a booking, you agree to be bound by these terms. If you disagree with any part, you may not use our services.
                    </p>
                  </div>

                  {/* Sections */}
                  {SECTIONS.map((section, index) => (
                    <section key={section.id} id={section.id} className="scroll-mt-28" style={{ marginBottom: '2.5rem' }}>
                      <h2 style={styles.sectionHeading}>
                        <span style={styles.sectionNumber}>{index + 1}</span>
                        {section.title}
                      </h2>
                      <SectionContent id={section.id} />
                    </section>
                  ))}

                  {/* Back to top */}
                  <div style={{ textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #e8e4dc' }}>
                    <a
                      href="#acceptance"
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
