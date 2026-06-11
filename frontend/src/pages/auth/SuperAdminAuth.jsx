import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiKey, FiLock, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function SuperAdminAuth() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '', token: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      if (res.success) {
        if (res.user.role === 'admin') {
          toast.success('Admin authentication successful');
          navigate(location.state?.from?.pathname || '/superadmin/dashboard', { replace: true });
        } else {
          toast.error('Security Violation. Access Denied.');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="System Administration | TravelGo" />
      <div className="min-h-screen relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>
        <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2.5 text-slate-500 hover:text-slate-300 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} /><span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)' }}>
                <FiShield className="text-slate-400" size={32} />
              </div>
              <h2 className="text-3xl font-light text-white mb-2 uppercase tracking-wider" style={{ fontFamily: 'monospace' }}>System Admin</h2>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Restricted Access</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 text-center" htmlFor="username">Admin ID</label>
                <input id="username" type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-all font-mono text-sm text-center" style={{ background: 'rgba(15,23,42,1)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 text-center" htmlFor="password">Passphrase</label>
                <input id="password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-all font-mono text-sm text-center" style={{ background: 'rgba(15,23,42,1)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 text-center" htmlFor="token">2FA Token</label>
                <input id="token" type="text" value={form.token} onChange={e => setForm({ ...form, token: e.target.value })} className="w-full px-4 py-3.5 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600/50 transition-all font-mono text-sm tracking-widest text-center" style={{ background: 'rgba(15,23,42,1)', border: '1px solid rgba(148,163,184,0.2)' }} placeholder="" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all mt-6 hover:-translate-y-0.5" style={{ background: 'rgba(226,232,240,1)', color: '#0f172a', boxShadow: '0 10px 30px rgba(226,232,240,0.2)' }}>
                {loading ? 'Authenticating...' : 'Authorize'}
              </button>
            </form>
            <div className="mt-8 text-center text-xs text-slate-600 uppercase tracking-widest">
              TravelGo Core Systems © {new Date().getFullYear()}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
