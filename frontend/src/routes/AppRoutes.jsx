import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RouteErrorBoundary } from '../components/ErrorBoundary';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const Home           = lazy(() => import('../pages/Home'));
const TrackTrip      = lazy(() => import('../pages/TrackTrip'));
const Packages       = lazy(() => import('../pages/Packages'));
const PackageDetail  = lazy(() => import('../pages/PackageDetail'));
const Blog           = lazy(() => import('../pages/Blog').then(m => ({ default: m.BlogList })));
const BlogDetail     = lazy(() => import('../pages/Blog').then(m => ({ default: m.BlogDetail })));
const About          = lazy(() => import('../pages/About'));
const Contact        = lazy(() => import('../pages/Contact'));
const Destinations   = lazy(() => import('../pages/Destinations.jsx'));
const DestinationDetail = lazy(() => import('../pages/DestinationDetail.jsx'));
const Payment        = lazy(() => import('../pages/Payment'));
const BookingsPage   = lazy(() => import('../pages/BookingsPage'));

// Auth Pages
const Login            = lazy(() => import('../pages/auth/Login'));
const SignUp           = lazy(() => import('../pages/auth/SignUp'));
const UserAuth         = lazy(() => import('../pages/auth/UserAuth'));
const AgencyAuth       = lazy(() => import('../pages/auth/AgencyAuth'));
const SuperAdminAuth   = lazy(() => import('../pages/auth/SuperAdminAuth'));
const ForgotPassword   = lazy(() => import('../pages/ForgotPassword'));

// Dashboard Pages
const UserDashboard       = lazy(() => import('../pages/UserDashboard'));
const UserOverview        = lazy(() => import('../pages/dashboards/UserOverview'));
const UserProfile         = lazy(() => import('../pages/dashboards/UserProfile'));
const Wishlist            = lazy(() => import('../pages/dashboards/Wishlist'));
const Notifications       = lazy(() => import('../pages/dashboards/Notifications'));
const PaymentHistory      = lazy(() => import('../pages/dashboards/PaymentHistory'));
const TravelHistory       = lazy(() => import('../pages/dashboards/TravelHistory'));
const Support             = lazy(() => import('../pages/dashboards/Support'));
const Settings            = lazy(() => import('../pages/dashboards/Settings'));

const AgencyDashboard     = lazy(() => import('../pages/dashboards/AgencyDashboard'));
const AdminDashboard      = lazy(() => import('../pages/admin/AdminDashboard'));

const FAQ            = lazy(() => import('../pages/FAQ'));
const Privacy        = lazy(() => import('../pages/Privacy'));
const Terms          = lazy(() => import('../pages/Terms'));
const NotFound       = lazy(() => import('../pages/NotFound'));

// ── Suspense fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '2px solid #4f46e5',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 12px',
          animation: 'tg-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes tg-spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#4f46e5', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
          Loading
        </p>
      </div>
    </div>
  );
}

// ── Route wrapper: Suspense + ErrorBoundary per route ────────────────────────
function SafeRoute({ children }) {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}

// ── Auth guard ────────────────────────────────────────────────────────────────
function Protected({ children, roles }) {
  const { user, isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

// ── Profile Redirect component ────────────────────────────────────────────────
function ProfileRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard/profile" replace />;
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/"                element={<SafeRoute><Home /></SafeRoute>} />
      <Route path="/track-trip"      element={<SafeRoute><TrackTrip /></SafeRoute>} />
      <Route path="/packages"        element={<SafeRoute><Packages /></SafeRoute>} />
      <Route path="/packages/:id"    element={<SafeRoute><PackageDetail /></SafeRoute>} />
      <Route path="/destinations"    element={<SafeRoute><Destinations /></SafeRoute>} />
      <Route path="/destinations/:id" element={<SafeRoute><DestinationDetail /></SafeRoute>} />
      <Route path="/blog"            element={<SafeRoute><Blog /></SafeRoute>} />
      <Route path="/blog/:id"        element={<SafeRoute><BlogDetail /></SafeRoute>} />
      <Route path="/about"           element={<SafeRoute><About /></SafeRoute>} />
      <Route path="/contact"         element={<SafeRoute><Contact /></SafeRoute>} />
      <Route path="/faq"             element={<SafeRoute><FAQ /></SafeRoute>} />
      <Route path="/privacy"         element={<SafeRoute><Privacy /></SafeRoute>} />
      <Route path="/terms"           element={<SafeRoute><Terms /></SafeRoute>} />

      {/* Auth Pages */}
      <Route path="/login"               element={<SafeRoute><Login /></SafeRoute>} />
      <Route path="/signup"              element={<SafeRoute><SignUp /></SafeRoute>} />
      <Route path="/auth"                element={<SafeRoute><UserAuth /></SafeRoute>} />
      <Route path="/forgot-password"     element={<SafeRoute><ForgotPassword /></SafeRoute>} />
      <Route path="/agency/login"        element={<SafeRoute><AgencyAuth /></SafeRoute>} />
      <Route path="/superadmin/login"    element={<SafeRoute><SuperAdminAuth /></SafeRoute>} />

      {/* Dashboards */}
      <Route path="/dashboard" element={<SafeRoute><Protected><UserDashboard /></Protected></SafeRoute>}>
        <Route index element={<UserOverview />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="history" element={<TravelHistory />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Fallback legacy routes pointing to dashboard */}
      <Route path="/bookings"              element={<Navigate to="/dashboard/bookings" replace />} />
      <Route path="/payment/:bookingId"    element={<SafeRoute><Protected><Payment /></Protected></SafeRoute>} />
      
      <Route path="/admin/dashboard/*"     element={<SafeRoute><Protected roles={['admin']}><AdminDashboard /></Protected></SafeRoute>} />
      <Route path="/superadmin/dashboard/*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/agency/dashboard/*"    element={<Navigate to="/dashboard" replace />} />
      <Route path="/profile"               element={<SafeRoute><Protected><ProfileRedirect /></Protected></SafeRoute>} />

      {/* Fallbacks */}
      <Route path="/admin/*"             element={<Navigate to="/superadmin/dashboard" replace />} />
      <Route path="/404"                 element={<SafeRoute><NotFound /></SafeRoute>} />
      <Route path="*"                    element={<SafeRoute><NotFound /></SafeRoute>} />
    </Routes>
  );
}
