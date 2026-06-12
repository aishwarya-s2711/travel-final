const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

// ── Validate env vars ─────────────────────────────────────────────────────────
['MONGODB_URI', 'JWT_SECRET'].forEach(k => {
  if (!process.env[k]) { console.error(`❌ Missing env var: ${k}`); process.exit(1); }
});

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS — allow Vite dev server + localhost ──────────────────────────────────
const ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

const corsOpts = {
  origin: '*',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOpts));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Dev request logger ────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health & root — MUST be before 404 handler ────────────────────────────────
app.get('/', (_req, res) => res.json({ message: 'TravelGo API \u2705', status: 'running', version: '1.0.0' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Not Connected"
  });
});

// Global error handler will be registered after API routes.

// ── Fix Node.js DNS — force Google DNS if system resolver is broken ────────
const dns = require('dns');
const nodeDefaultDNS = dns.getServers();
if (
  nodeDefaultDNS.length === 0 ||
  nodeDefaultDNS.every(s => s === '127.0.0.1' || s === '::1')
) {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  console.log('🔧 Node.js DNS was pointing to localhost — switched to Google/Cloudflare DNS');
  console.log(`   Old: [${nodeDefaultDNS.join(', ')}]  →  New: [${dns.getServers().join(', ')}]`);
}

// ── MongoDB + Boot ────────────────────────────────────────────────────────────
mongoose.connection.on('connected',    () => console.log('✅ MongoDB connected'));
mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => console.log('✅ MongoDB reconnected'));
mongoose.connection.on('error',        e  => console.error('❌ MongoDB error:', e.message));

// ── Fallback Mock API Interceptor (runs if MongoDB is not connected) ───────────
const MOCK_PACKAGES = [
  {
    _id: "65432101abcdef0011223301",
    title: "Switzerland Alpine Panoramic Trail",
    destination: "Zermatt",
    country: "Switzerland",
    price: 1450,
    originalPrice: 1750,
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    durationNights: 5,
    availableSeats: 8,
    rating: 4.9,
    reviews: 124,
    category: "Adventure",
    highlights: ["Matterhorn Panoramic View", "Alpine Guided Trek", "Chalet Stay"],
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    isActive: true,
    status: "Active"
  },
  {
    _id: "65432101abcdef0011223302",
    title: "Jungfrau Exploration Trails",
    destination: "Grindelwald",
    country: "Switzerland",
    price: 1680,
    originalPrice: 1980,
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    durationNights: 6,
    availableSeats: 12,
    rating: 4.8,
    reviews: 98,
    category: "Adventure",
    highlights: ["Glacier Gorge Walk", "Eiger North Face Hike", "Glacier Express Train"],
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
    isActive: true,
    status: "Active"
  },
  {
    _id: "65432101abcdef0011223303",
    title: "Lauterbrunnen Panoramic Valley Trek",
    destination: "Lauterbrunnen",
    country: "Switzerland",
    price: 1250,
    originalPrice: 1490,
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    durationNights: 4,
    availableSeats: 15,
    rating: 4.9,
    reviews: 156,
    category: "Adventure",
    highlights: ["72 Waterfalls Tour", "Schilthorn Summit View", "Cable Car Passes"],
    coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=85",
    isActive: true,
    status: "Active"
  },
  {
    _id: "65432101abcdef0011223304",
    title: "Interlaken Lakes & Ridge Hike",
    destination: "Interlaken",
    country: "Switzerland",
    price: 1190,
    originalPrice: 1390,
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    durationNights: 5,
    availableSeats: 10,
    rating: 4.7,
    reviews: 74,
    category: "Adventure",
    highlights: ["Harder Kulm Panoramic Ridge", "Lake Thun Cruise", "Paragliding Experience"],
    coverImage: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=800&q=85",
    isActive: true,
    status: "Active"
  },
  {
    _id: "65432101abcdef0011223305",
    title: "Swiss Glacier Exploration Tour",
    destination: "St. Moritz",
    country: "Switzerland",
    price: 1950,
    originalPrice: 2250,
    duration: "8 Days / 7 Nights",
    durationDays: 8,
    durationNights: 7,
    availableSeats: 14,
    rating: 4.8,
    reviews: 62,
    category: "Adventure",
    highlights: ["Bernina Express Scenic Train", "Glacier Cave Walk", "Luxury Wellness Spa"],
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=85",
    isActive: true,
    status: "Active"
  },
  {
    _id: "65432101abcdef0011223306",
    title: "Engadin Valley Panoramic Trails",
    destination: "Engadin",
    country: "Switzerland",
    price: 1380,
    originalPrice: 1580,
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    durationNights: 5,
    availableSeats: 16,
    rating: 4.9,
    reviews: 45,
    category: "Adventure",
    highlights: ["National Park Trails", "Historic Village Tour", "Traditional Swiss Dining"],
    coverImage: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&q=85",
    isActive: true,
    status: "Active"
  }
];

const MOCK_DESTINATIONS = [
  { id: "1", name: "Zermatt", country: "Switzerland", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85", category: "Adventure", description: "Iconic Matterhorn views, panoramic hiking trails, and car-free alpine charm.", active: true },
  { id: "2", name: "Grindelwald", country: "Switzerland", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85", category: "Adventure", description: "Epic Eiger mountain walls, glacier hikes, and direct mountain access.", active: true },
  { id: "3", name: "Lauterbrunnen", country: "Switzerland", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=85", category: "Adventure", description: "Deep valley of 72 misting waterfalls, soaring cliffs, and scenic trails.", active: true },
  { id: "4", name: "Interlaken", country: "Switzerland", image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=800&q=85", category: "Adventure", description: "Alpine gateway nestled between lakes, boasting stunning ridgeline walks.", active: true }
];

const MOCK_BLOGS = [
  { _id: "65432101abcdef00112233b1", title: 'Top 5 Switzerland Trails Every Explorer Must Hike', category: 'Adventure', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', author: { name: 'Thomas Mueller' }, date: 'May 15, 2026', readTime: '5 min read', excerpt: 'From the high ridge of Harder Kulm to the iconic Zermatt loops, discover the ultimate panoramic walks...', tags: ['Switzerland', 'Trails', 'Adventure'], isPublished: true, views: 12 },
  { _id: "65432101abcdef00112233b2", title: 'Planning Your First Alpine Exploration Travels: A Complete Guide', category: 'Adventure', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', author: { name: 'James Wilson' }, date: 'April 28, 2026', readTime: '8 min read', excerpt: 'Everything you need to know about packing, route selection, and weather prep for Swiss high trails...', tags: ['Switzerland', 'Exploration', 'Guide'], isPublished: true, views: 24 },
  { _id: "65432101abcdef00112233b3", title: 'The Best Panoramic Views in Switzerland: Where to Stand', category: 'Adventure', image: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?w=600&q=80', author: { name: 'Priya Patel' }, date: 'April 10, 2026', readTime: '6 min read', excerpt: 'We highlight the top viewpoints in the Swiss Alps, including Schilthorn and Gornergrat...', tags: ['Switzerland', 'Views', 'Panoramas'], isPublished: true, views: 42 }
];

const MOCK_CATEGORIES = [
  { name: 'Adventure Tours', description: 'Trekking & hiking', image1: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80', image2: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80', packageCount: 12, order: 1 },
  { name: 'Family Trips', description: 'Fun for everyone', image1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', image2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', packageCount: 18, order: 2 },
  { name: 'Honeymoon Packages', description: 'Romantic getaways', image1: 'https://images.unsplash.com/photo-1519659528534-7fd73f9311a5?w=600&q=80', image2: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', packageCount: 15, order: 3 },
  { name: 'Beach Vacations', description: 'Sun & sand fun', image1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', image2: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80', packageCount: 20, order: 4 },
  { name: 'Hill Station Tours', description: 'Mountain escapes', image1: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', image2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', packageCount: 14, order: 5 },
  { name: 'Cultural Tours', description: 'Heritage & history', image1: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', image2: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&q=80', packageCount: 10, order: 6 },
  { name: 'Luxury Experiences', description: 'Premium travel', image1: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', image2: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', packageCount: 16, order: 7 }
];

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    if (req.method === 'GET' && req.path === '/api/packages') {
      return res.json({ packages: MOCK_PACKAGES, total: MOCK_PACKAGES.length });
    }
    if (req.method === 'GET' && req.path === '/api/packages/destinations') {
      return res.json(MOCK_DESTINATIONS.map(d => ({ name: d.name, country: d.country, image: d.image, packages: 1 })));
    }
    if (req.method === 'GET' && req.path.startsWith('/api/packages/')) {
      const pkgId = req.path.split('/').pop();
      const foundPkg = MOCK_PACKAGES.find(p => p._id === pkgId || p.id === pkgId);
      if (foundPkg) {
        return res.json(foundPkg);
      }
      return res.json(MOCK_PACKAGES[0]);
    }
    if (req.method === 'GET' && req.path === '/api/public/destinations') {
      return res.json(MOCK_DESTINATIONS);
    }
    if (req.method === 'GET' && req.path === '/api/public/blogs') {
      return res.json(MOCK_BLOGS);
    }
    if (req.method === 'GET' && req.path.startsWith('/api/public/blogs/')) {
      const blogId = req.path.split('/').pop();
      const foundBlog = MOCK_BLOGS.find(b => b._id === blogId || b.id === Number(blogId));
      if (foundBlog) {
        return res.json(foundBlog);
      }
      return res.status(404).json({ message: 'Blog not found (offline)' });
    }
    if (req.method === 'POST' && req.path === '/api/auth/login') {
      return res.json({
        token: "mock_jwt_token_for_offline_testing",
        user: { id: "mock_user_id", name: "Demo User", email: req.body.email || "demo@travelgo.com", role: "user" }
      });
    }
    if (req.method === 'POST' && req.path === '/api/auth/signup') {
      return res.json({
        token: "mock_jwt_token_for_offline_testing",
        user: { id: "mock_user_id", name: req.body.name || "Demo User", email: req.body.email || "demo@travelgo.com", role: "user" }
      });
    }
    if (req.method === 'GET' && req.path === '/api/bookings/user') {
      return res.json([]);
    }
  }
  next();
});

// ── Vercel Serverless MongoDB Connection ──────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const connOpts = {
    dbName: 'travelgo',
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  };
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, connOpts);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

// Ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ── Register API Routes ──────────────────────
app.use('/api/auth',          require('./routers/authRoutes'));
app.use('/api/packages',      require('./routers/packageRoutes'));
app.use('/api/bookings',      require('./routers/bookingRoutes'));
app.use('/api/users',         require('./routers/userrouter'));
app.use('/api/admin',         require('./routers/adminRoutes'));
app.use('/api/reviews',       require('./routers/reviewRoutes'));
app.use('/api/notifications', require('./routers/notificationRoutes'));
app.use('/api/categories',    require('./routers/categoryRoutes'));
console.log('Mounting /api/public routes...');
app.use('/api/public',        require('./routers/publicRoutes'));

// ── 404 handler ─────────────────────────────────────────────────────────
// Only serve static files locally, Vercel handles static routing via vercel.json
if (!process.env.VERCEL) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Fallback for API routes that are not found
app.use('/api/*', (req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.path}` }));

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `${field} already exists` });
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Local Development Startup ────────────────────────────────────────────────
if (!process.env.VERCEL) {
  (async () => {
    await connectDB();
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      const mongoStatus = mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️  Not Connected';

      console.log('');
      console.log('┌────────────────────────────────────────┐');
      console.log('│  🚀 TravelGo Backend READY             │');
      console.log(`│  Local    : http://localhost:${PORT}        │`);
      console.log(`│  Health   : http://localhost:${PORT}/api/health │`);
      console.log(`│  Mode     : ${(process.env.NODE_ENV || 'development').padEnd(24)}│`);
      console.log(`│  MongoDB  : ${mongoStatus.padEnd(24)}│`);
      console.log('└────────────────────────────────────────┘');
    });
  })();
}

// Export for Vercel Serverless
module.exports = app;
