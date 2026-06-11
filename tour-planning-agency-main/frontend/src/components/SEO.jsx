import { Helmet } from 'react-helmet-async';

const SITE = 'TravelGo';
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85';

export default function SEO({ title, description, image, canonical, schema }) {
  const fullTitle = title ? `${title} — ${SITE}` : `${SITE} — Luxury Travel & Tour Packages`;
  const desc = description || 'Discover 500+ curated luxury tour packages to Santorini, Maldives, Bali, Switzerland and 80+ destinations. Book your dream journey with TravelGo.';
  const img = image || DEFAULT_IMG;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {canonical && <link rel="canonical" href={`https://www.travelgo.com${canonical}`} />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image"       content={img} />
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={img} />

      {/* JSON-LD per-page schema */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
