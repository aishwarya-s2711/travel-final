import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-email', { email });
      if (res.data.success) {
        toast.success('Email verified! Please enter your new password.');
        setStep(2);
      } else {
        toast.error(res.data.message || 'Email not found');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      if (res.data.success) {
        toast.success('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(res.data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password | TravelGo" />
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 20, ease: 'easeOut' }} src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90" alt="Mountain sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-transparent" />
        </div>
        <Link to="/login" className="absolute top-6 left-6 z-20 flex items-center gap-2.5 text-white/90 hover:text-white transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} /><span className="text-sm font-medium">Back to Login</span>
        </Link>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Reset Password</h2>
              <p className="text-white/70 text-sm">{step === 1 ? 'Enter your email to continue' : 'Enter your new password'}</p>
            </div>
            {step === 1 ? (
              <form className="space-y-4" onSubmit={handleEmailSubmit}>
                <div>
                  <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="email">Email Address</label>
                  <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mt-6 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0f172a', boxShadow: '0 10px 30px rgba(245,158,11,0.4)' }}>
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handlePasswordReset}>
                <div>
                  <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="otp">6-Digit OTP</label>
                  <input id="otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-center mb-4" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="" maxLength="6" />
                </div>
                <div>
                  <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="newPassword">New Password</label>
                  <div className="relative">
                    <input id="newPassword" type={showPw ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-12 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors">
                      {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirmPw ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-12 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="" />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors">
                      {showConfirmPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mt-6 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#0f172a', boxShadow: '0 10px 30px rgba(245,158,11,0.4)' }}>
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
