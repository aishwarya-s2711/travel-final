import { Component } from 'react';

/**
 * ErrorBoundary — catches any React render/lifecycle error.
 * Without this, a single component crash = entire white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary fallback={<p>Custom fallback</p>}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // Log to console with full stack for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', info?.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null, info: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    // Custom fallback if provided
    if (this.props.fallback) return this.props.fallback;

    const isDev = import.meta.env.DEV;

    return (
      <div
        role="alert"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
          background: '#f8f6f2',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 28,
          fontWeight: 300,
          color: '#0f172a',
          marginBottom: 8,
        }}>
          Something went wrong
        </h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24, maxWidth: 400 }}>
          This section encountered an error. The rest of the page is unaffected.
        </p>

        {/* Show error details only in development */}
        {isDev && this.state.error && (
          <details style={{
            marginBottom: 24,
            padding: '12px 16px',
            background: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            textAlign: 'left',
            maxWidth: 600,
            width: '100%',
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#dc2626', fontSize: 13 }}>
              Error Details (dev only)
            </summary>
            <pre style={{ fontSize: 11, marginTop: 8, whiteSpace: 'pre-wrap', color: '#7f1d1d', overflow: 'auto' }}>
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.info?.componentStack}
            </pre>
          </details>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.reset}
            style={{
              padding: '10px 24px',
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Try Again
          </button>
          <a href="/" style={{ padding: '10px 24px', border: '2px solid #0f172a', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>Go Home</a>
        </div>
      </div>
    );
  }
}

/**
 * RouteErrorBoundary — minimal boundary for lazy-loaded routes.
 * Shows a spinner-style fallback with retry.
 */
export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[RouteErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f6f2',
        fontFamily: 'DM Sans, sans-serif',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ fontSize: 40 }}>🔄</div>
        <p style={{ color: '#0f172a', fontSize: 16, fontWeight: 500 }}>
          Page failed to load
        </p>
        <button
          onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          style={{
            padding: '10px 24px',
            background: '#7C3AED',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
}
