import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowLeft, FiCheck, FiAlertCircle, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import './Auth.css';

// Custom hook for loading states
function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [disabled, setDisabled] = useState(initialState);

  const setLoadingState = (isLoading) => {
    setLoading(isLoading);
    setDisabled(isLoading);
  };

  return { loading, setLoadingState, disabled, setDisabled };
}

// Password strength checker
function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading: loginLoading, setLoadingState: setLoginLoading, disabled: loginDisabled } = useLoading();
  const { loading: signupLoading, setLoadingState: setSignupLoading, disabled: signupDisabled } = useLoading();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
  }, [isLogin]);

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== form.password) error = 'Passwords do not match';
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
    
    let isValid = true;
    if (!isLogin) {
      isValid = validateField('name', form.name) && isValid;
      isValid = validateField('confirmPassword', form.confirmPassword) && isValid;
    }
    isValid = validateField('email', form.email) && isValid;
    isValid = validateField('password', form.password) && isValid;

    if (!isValid) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    if (isLogin) {
      setLoginLoading(true);
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
        setLoginLoading(false);
      }
    } else {
      setSignupLoading(true);
      try {
        const res = await signup({ 
          name: form.name, 
          email: form.email, 
          password: form.password, 
          role: form.role 
        });
        if (res.success) {
          toast.success('Account created successfully! Welcome to TravelGo!');
          if (form.role === 'admin') navigate('/superadmin/dashboard', { replace: true });
          else if (form.role === 'agent') navigate('/agency/dashboard', { replace: true });
          else navigate('/dashboard', { replace: true });
        } else {
          toast.error(res.message || 'Signup failed. Please try again.');
        }
      } catch {
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setSignupLoading(false);
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <>
      <SEO title={isLogin ? 'Sign In | TravelGo' : 'Create Account | TravelGo'} />
      <div className="auth-container">
        {/* Back to Home */}
        <Link 
          to="/"
          className="back-to-home"
        >
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
            key={isLogin ? 'login-title' : 'signup-title'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </motion.h1>
          
          <motion.p
            className="subtitle"
            key={isLogin ? 'login-subtitle' : 'signup-subtitle'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {isLogin 
              ? 'Sign in to continue your journey' 
              : 'Join us and start your next adventure today.'}
          </motion.p>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              className="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
            >
              {/* Signup: Role Selection */}
              {!isLogin && (
                <motion.div
                  className="input-group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label>Account Type</label>
                  <div className="role-selector">
                    {[
                      { value: 'user', label: 'Traveler' },
                      { value: 'admin', label: 'Admin' }
                    ].map((option) => (
                      <label key={option.value} className={`role-option ${form.role === option.value ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={form.role === option.value}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        />
                        <span>{option.label}</span>
                        {form.role === option.value && <FiCheck size={14} />}
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Name Field (Signup only) */}
              {!isLogin && (
                <motion.div
                  className="input-group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={(e) => validateField('name', e.target.value)}
                      placeholder=""
                      className={errors.name ? 'error' : ''}
                      disabled={signupLoading}
                    />
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div
                className="input-group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: !isLogin ? 0.4 : 0.3 }}
              >
                <label>Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField('email', e.target.value)}
                    placeholder=""
                    className={errors.email ? 'error' : ''}
                    disabled={loginLoading || signupLoading}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </motion.div>

              {/* Password Field */}
              <motion.div
                className="input-group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: !isLogin ? 0.45 : 0.35 }}
              >
                <label>Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleChange(e);
                    }}
                    onBlur={(e) => validateField('password', e.target.value)}
                    placeholder=""
                    className={errors.password ? 'error' : ''}
                    disabled={loginLoading || signupLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {!isLogin && passwordStrength > 0 && (
                  <div className="password-strength">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`strength-bar ${
                          passwordStrength >= level 
                            ? passwordStrength <= 1 
                              ? 'weak' 
                              : passwordStrength <= 2 
                                ? 'fair' 
                                : passwordStrength === 3 
                                  ? 'good' 
                                  : 'strong'
                            : 'empty'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {errors.password && <span className="error-text">{errors.password}</span>}
              </motion.div>

              {/* Confirm Password Field (Signup only) */}
              {!isLogin && (
                <motion.div
                  className="input-group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                        if (errors.confirmPassword) validateField('confirmPassword', e.target.value);
                      }}
                      onBlur={(e) => validateField('confirmPassword', e.target.value)}
                      placeholder=""
                      className={errors.confirmPassword ? 'error' : ''}
                      disabled={signupLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </motion.div>
              )}

              {/* Remember Me & Forgot Password (Login only) */}
              {isLogin && (
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
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="login-btn"
                disabled={loginDisabled || signupDisabled}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: !isLogin ? 0.55 : 0.45 }}
              >
                {(loginLoading || signupLoading) ? (
                  <>
                    <span className="spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiLogIn size={18} />
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </motion.button>

              {/* Toggle Link */}
              <motion.p
                className="signup-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: !isLogin ? 0.6 : 0.5 }}
              >
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="toggle-link"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </motion.p>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="auth-footer">
          © {new Date().getFullYear()} TravelGo. All rights reserved.
        </p>
      </div>
    </>
  );
}