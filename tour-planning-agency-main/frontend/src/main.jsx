/* eslint-disable react-refresh/only-export-components */
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-t-transparent rounded-full mx-auto mb-4"
          style={{ borderColor: '#7C3AED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p className="text-sm tracking-widest uppercase" style={{ color: '#7C3AED', fontFamily: 'DM Sans, sans-serif' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<PageLoader />}>
        <App />
      </Suspense>
    </HelmetProvider>
  </StrictMode>,
);
