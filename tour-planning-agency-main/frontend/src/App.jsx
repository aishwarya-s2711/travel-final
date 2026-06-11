import { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { FiArrowUp } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Global error listeners - catch unhandled errors before React sees them
if (typeof window !== 'undefined') {
  // Prevent errors from crashing the app
  window.addEventListener('error', (e) => {
    console.error('[Global Error]', e.message, e.filename, e.lineno);
    // Prevent the default browser error handling which can cause blank screens
    e.preventDefault();
    return true;
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('[Unhandled Promise Rejection]', e.reason);
    // Prevent unhandled promise rejections from crashing
    e.preventDefault();
    return true;
  });

  // Handle navigation errors
  window.addEventListener('popstate', () => {
    // Ensure app state is maintained on back/forward navigation
    console.log('[Navigation] Browser back/forward button pressed');
  });
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Scroll error:', error);
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  
  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const [showScroll, setShowScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/auth' || pathname.includes('/auth/');
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  // Handle scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      try {
        setShowScroll(window.scrollY > 400);
      } catch (error) {
        console.error('Scroll handler error:', error);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor route changes for loading states
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Skip to main content link */}
      {!isAuthPage && (
        <a 
          href="#main-content" 
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            zIndex: 999,
            padding: '1em',
            backgroundColor: '#0f172a',
            color: 'white',
            textDecoration: 'none'
          }}
        >
          Skip to main content
        </a>
      )}

      <ScrollToTop />

      {/* Navbar with error boundary */}
      {!isAdminPage && !isAuthPage && (
        <ErrorBoundary fallback={null}>
          <Navbar />
        </ErrorBoundary>
      )}

      {/* Main content with routes */}
      <main id="main-content" style={{ minHeight: '100vh' }}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>

      {/* WhatsApp float button */}
      {!isAdminPage && !isAuthPage && (
        <a
          href="https://wa.me/911234567890?text=Hi%20TravelGo!%20I'd%20like%20to%20plan%20a%20trip."
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat with us on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '56px',
            height: '56px',
            backgroundColor: '#25D366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            zIndex: 1000,
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FaWhatsapp size={28} color="#fff" />
        </a>
      )}

      {/* Scroll to top button */}
      {showScroll && !isAdminPage && (
        <button
          onClick={() => {
            try {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
              window.scrollTo(0, 0);
            }
          }}
          className="fixed w-12 h-12 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all"
          style={{ 
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            zIndex: 1000,
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ 
          fontFamily: 'DM Sans, sans-serif', 
          fontSize: '0.9rem',
          borderRadius: '12px'
        }}
      />

      {/* Global loading indicator (optional) */}
      {isLoading && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
          }}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { width: 0%; }
          to { width: 100%; }
        }

        .skip-link:focus {
          left: 0;
          top: 0;
        }

        /* Prevent FOUC (Flash of Unstyled Content) */
        html {
          visibility: visible;
          opacity: 1;
        }

        /* Smooth page transitions */
        #main-content {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default function App() {
  // Prevent app crashes from error boundaries
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state on route changes
    const handleRouteChange = () => setHasError(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (hasError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'DM Sans, sans-serif',
        backgroundColor: '#F8FAFC'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#0F172A' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', textAlign: 'center', maxWidth: '500px' }}>
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Refresh Page
          </button>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#0F172A',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC'
      }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Reload Application
        </button>
      </div>
    }>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
