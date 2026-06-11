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

// ── Register API Routes ──────────────────────
app.use('/api/auth',          require('./routers/authRoutes'));
app.use('/api/packages',      require('./routers/packageRoutes'));
app.use('/api/bookings',      require('./routers/bookingRoutes'));
app.use('/api/users',         require('./routers/userrouter'));
app.use('/api/admin',         require('./routers/adminRoutes'));
app.use('/api/reviews',       require('./routers/reviewRoutes'));
app.use('/api/notifications', require('./routers/notificationRoutes'));
console.log('Mounting /api/public routes...');
app.use('/api/public',        require('./routers/publicRoutes'));

// ── 404 handler ─────────────────────────────────────────────────────────
// Serve static files from the React frontend app
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback for API routes that are not found
app.use('/api/*', (req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.path}` }));

// Catch-all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ── Global error handler ──────────────────────────────────────────────────────
// 4-arg signature required by Express — do NOT remove _next
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

(async () => {
  // Mongoose connection options — tuned for Atlas
  const connOpts = {
    dbName: 'travelgo',
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  };

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, connOpts);
    console.log(`\n✅ MongoDB Connected Successfully!`);
  } catch (err) {
    console.error('\n❌ MongoDB connection error:');
    console.error(`Reason: ${err.message}`);
    
    // Robust error handling and troubleshooting steps
    if (err.name === 'MongoServerSelectionError' ||
        err.message.includes('ETIMEDOUT') || 
        err.message.includes('ECONNREFUSED') || 
        err.message.includes('querySrv ECONNREFUSED') ||
        err.message.includes('ENOTFOUND') ||
        err.message.includes('Could not connect')) {
       console.error('\nTroubleshooting steps:');
       console.error('1. Check Atlas Network Access: Ensure 0.0.0.0/0 is added.');
       console.error('2. Ensure your firewall/network is not blocking port 27017.');
       console.error('3. Verify that the database user exists and password is correct.');
       console.error('4. Check if the connection string loaded from .env is correct.');
    }
    console.error('\nBackend starting anyway for testing purposes...\n');
  }

  // ── Start Express server ──────────────────────────────────────────────────
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
    console.log('\nℹ️  Available API Endpoints:');
    console.log('   POST   /api/bookings      - Create booking');
    console.log('   GET    /api/bookings/user  - Get my bookings');
    console.log('   GET    /api/packages       - Get all packages');
    console.log('   POST   /api/auth/login     - User login');
    console.log('   POST   /api/auth/signup    - User signup');
    console.log('   GET    /api/health         - Health check');

    if (mongoose.connection.readyState !== 1) {
      console.log('\n❌ MongoDB not connected — API routes disabled');
      console.log('   Run: node check-ip.js to see Atlas setup instructions\n');
    } else {
      console.log('');
    }
  });
})();
