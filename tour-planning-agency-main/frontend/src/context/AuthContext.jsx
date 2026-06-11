/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tg_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('tg_token') || null);

  /* ── persist helper ── */
  const persist = (tok, usr) => {
    localStorage.setItem('tg_token', tok);
    localStorage.setItem('tg_user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  /* ── LOGIN ── */
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data.token, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  /* ── SIGNUP ── */
  const signup = async (formData) => {
    try {
      const { data } = await api.post('/auth/signup', formData);
      persist(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Signup failed' };
    }
  };

  /* ── LOGOUT ── */
  const logout = () => {
    localStorage.removeItem('tg_token');
    localStorage.removeItem('tg_user');
    setUser(null);
    setToken(null);
  };

  /* ── GET PROFILE from backend ── */
  const refreshUser = async () => {
    const tok = localStorage.getItem('tg_token');
    // Don't hit the backend with demo/local tokens — they will 401 and
    // the old interceptor would have redirected; now we just skip.
    if (!tok || tok.startsWith('demo_') || tok.startsWith('local_')) return;
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('tg_user', JSON.stringify(data));
      setUser(data);
    } catch { /* ignore — offline or token expired */ }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      signup,
      logout,
      refreshUser,
      isLoggedIn: !!user,
      isAdmin:    user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
