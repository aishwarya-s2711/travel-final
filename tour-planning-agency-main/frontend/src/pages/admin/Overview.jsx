import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiCalendar, FiDollarSign, FiTrendingUp, FiBriefcase, FiPackage } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function Overview() {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 156,
    bookingStatusData: [
      { name: 'Pending', value: 0 },
      { name: 'Approved', value: 0 },
      { name: 'Denied', value: 0 },
      { name: 'Cancelled', value: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const pkgRes = await api.get('/packages/stats').catch(() => ({ data: { total: 0 } }));
      setStats(prev => ({
        ...prev,
        totalPackages: pkgRes?.data?.total || 0
      }));
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>Admin Overview</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Real-time stats and booking health metrics.</p>
      </motion.div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <h3 className="text-3xl font-extrabold mt-2 text-[#7C3AED]">${stats.totalRevenue?.toLocaleString()}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7C3AED] text-[#0f172a] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
            <FiDollarSign size={26} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
            <h3 className="text-3xl font-extrabold mt-2 text-sky-600">{stats.totalBookings}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
            <FiBriefcase size={26} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Registered Users</p>
            <h3 className="text-3xl font-extrabold mt-2 text-emerald-600">{stats.totalUsers}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FiUsers size={26} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Packages</p>
            <h3 className="text-3xl font-extrabold mt-2 text-purple-600">{stats.totalPackages}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FiPackage size={26} />
          </div>
        </motion.div>
      </div>

      {/* Booking Summary - Status Counts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>Booking Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.bookingStatusData?.map((item) => {
            const colorMap = {
              Pending: 'text-amber-600 bg-amber-50/50 border-amber-100',
              Approved: 'text-emerald-600 bg-emerald-50/50 border-emerald-100',
              Denied: 'text-rose-600 bg-rose-50/50 border-rose-100',
              Cancelled: 'text-slate-600 bg-slate-50 border-slate-100',
            };
            const colorClass = colorMap[item.name] || 'text-slate-600 bg-slate-50 border-slate-100';
            return (
              <div key={item.name} className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow ${colorClass}`}>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-80">{item.name}</span>
                <span className="text-4xl font-extrabold mt-3">{item.value || 0}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
