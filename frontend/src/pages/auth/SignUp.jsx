import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import SEO from '../../components/SEO';
import './Auth.css';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'user' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = form;
      const res = await signup(signupData);
      if (res.success) {
        toast.success('Account created successfully!');
        if (form.role === 'admin') navigate('/superadmin/dashboard', { replace: true });
        else navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.message || 'Sign up failed.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign Up | TravelGo" />
      <div className="auth-container">
        <Link to="/" className="back-to-home">
          <FiArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <div className="auth-card">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5">
                <circle cx="12" cy="12" r="9" opacity="0.6" />
                <path d="M3.6 12h16.8" opacity="0.6" />
                <path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" opacity="0.6" />
                <path d="M21 3L10.5 13.5M21 3l-6 16.5-3.5-7.5-7.5-3.5L21 3z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="logo-text">TravelGo</h1>
          </div>

          <h2 className="welcome-title">Create Account</h2>
          <p className="subtitle">Join TravelGo and start your journey</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="premium-input-container">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder=" "
                  className="premium-input"
                />
                <FiUser className="input-icon text-lg" />
                <label className="premium-label">Full Name</label>
              </div>
            </div>

            <div className="input-group">
              <div className="premium-input-container">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder=" "
                  className="premium-input"
                />
                <FiMail className="input-icon text-lg" />
                <label className="premium-label">Email Address</label>
              </div>
            </div>

            <div className="input-group">
              <div className="premium-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder=" "
                  minLength="6"
                  className="premium-input"
                  style={{ paddingRight: '48px' }}
                />
                <FiLock className="input-icon text-lg" />
                <label className="premium-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  style={{ top: '50%', transform: 'translateY(-50%)', margin: 0, padding: 0 }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <div className="premium-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder=" "
                  minLength="6"
                  className="premium-input"
                  style={{ paddingRight: '48px' }}
                />
                <FiLock className="input-icon text-lg" />
                <label className="premium-label">Confirm Password</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                  style={{ top: '50%', transform: 'translateY(-50%)', margin: 0, padding: 0 }}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 pl-2">Account Type</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full h-[58px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-sm cursor-pointer"
                required
              >
                <option value="user">User - Book and explore destinations</option>
                <option value="admin">Admin - Manage platform</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full mt-2"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            <p className="signup-link">
              Already have an account? <Link to="/login" className="toggle-link">Login</Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="auth-footer">
          © {new Date().getFullYear()} TravelGo. All rights reserved.
        </p>
      </div>
    </>
  );
}
