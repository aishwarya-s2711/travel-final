import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiAlertCircle, FiLogIn, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import './Auth.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    isValid = validateField('email', form.email) && isValid;
    isValid = validateField('password', form.password) && isValid;

    if (!isValid) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        toast.success('Welcome back to TravelGo!');
        if (res.user?.role === 'admin') navigate('/superadmin/dashboard', { replace: true });
        else if (res.user?.role === 'agent') navigate('/agency/dashboard', { replace: true });
        else navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      } else {
        toast.error(res.message || 'Invalid email or password');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In | TravelGo" />
      <div className="auth-container">
        {/* Back to Home */}
        <Link to="/" className="back-to-home">
          <FiArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="auth-card"
        >
          {/* Logo Section */}
          <motion.div
            className="logo-section"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5">
                <circle cx="12" cy="12" r="9" opacity="0.6" />
                <path d="M3.6 12h16.8" opacity="0.6" />
                <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" opacity="0.6" />
                <path d="M21 3L10.5 13.5M21 3l-6 16.5-3.5-7.5-7.5-3.5L21 3z" fill="currentColor" />
              </svg>
            </div>
            <span className="logo-text">TravelGo</span>
          </motion.div>

          {/* Titles */}
          <motion.h1
            className="welcome-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h1>
          
          <motion.p
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Sign in to continue your journey
          </motion.p>

          {/* Form */}
          <motion.form
            className="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
          >
            {/* Email Field */}
            <motion.div
              className="input-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="premium-input-container">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField('email', e.target.value)}
                  placeholder=" "
                  className={`premium-input ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' : ''}`}
                  disabled={loading}
                />
                <FiMail className="input-icon text-lg" />
                <label className="premium-label">Email Address</label>
              </div>
              {errors.email && (
                <span className="error-text pl-2">
                  <FiAlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              className="input-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="premium-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={(e) => validateField('password', e.target.value)}
                  placeholder=" "
                  className={`premium-input ${errors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' : ''}`}
                  disabled={loading}
                  style={{ paddingRight: '48px' }}
                />
                <FiLock className="input-icon text-lg" />
                <label className="premium-label">Password</label>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ top: '50%', transform: 'translateY(-50%)', margin: 0, padding: 0 }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-text pl-2">
                  <FiAlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              className="login-options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="btn-premium w-full mt-2"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              whileHover={!loading ? { y: -2 } : {}}
              whileTap={!loading ? { y: 0 } : {}}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  Sign In
                  <FiArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Toggle Link */}
            <motion.p
              className="signup-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Don't have an account?{' '}
              <Link to="/signup" className="toggle-link">
                Sign Up
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>

        {/* Footer */}
        <p className="auth-footer">
          © {new Date().getFullYear()} TravelGo. All rights reserved.
        </p>
      </div>
    </>
  );
}
