import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function AgencyAuth() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        if (res.user.role === 'agent' || res.user.role === 'admin') {
          toast.success('Welcome to Agency Portal');
          navigate(location.state?.from?.pathname || '/agency/dashboard', { replace: true });
        } else {
          toast.error('Unauthorized. Agency account required.');
        }
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Agency Partner Portal | TravelGo" />
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 20, ease: 'easeOut' }} src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=90" alt="Travel agency" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/70 to-transparent" />
        </div>
        <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2.5 text-white/90 hover:text-white transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} /><span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Partner Login</h2>
              <p className="text-white/70 text-sm">Manage packages, tours & bookings</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="email">Partner Email</label>
                <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="agency@example.com" />
              </div>
              <div>
                <label className="block text-white text-xs font-semibold mb-2 text-center" htmlFor="password">Password</label>
                <div className="relative">
                  <input id="password" type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-12 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all text-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors">
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-indigo-400" />
                <span className="text-xs text-white/70 font-medium select-none">Remember me</span>
              </label>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mt-6 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', color: 'white', boxShadow: '0 10px 30px rgba(99,102,241,0.4)' }}>
                {loading ? 'Authenticating...' : 'Sign in to Portal'}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-white/60">
              Not a partner yet? <a href="#" className="text-indigo-300 hover:text-indigo-200 font-semibold">Apply here</a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
