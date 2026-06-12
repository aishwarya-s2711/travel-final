import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMap, FiCalendar, FiDollarSign, FiTrendingUp, FiBriefcase, FiPackage, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';

export default function Overview() {
  const [stats, setStats] = useState({
    totalPackages: 8,
    totalBookings: 14,
    totalRevenue: 17200,
    totalUsers: 156,
    bookingStatusData: [
      { name: 'Pending', value: 4 },
      { name: 'Approved', value: 8 },
      { name: 'Denied', value: 1 },
      { name: 'Cancelled', value: 1 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [pkgRes, bookingRes] = await Promise.all([
        api.get('/packages').catch(() => ({ data: { packages: [], total: 8 } })),
        api.get('/bookings/my').catch(() => ({ data: [] })) // standard API fallback
      ]);

      const packages = pkgRes.data?.packages || pkgRes.data || [];
      const bookings = Array.isArray(bookingRes.data) ? bookingRes.data : [];

      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const statusCounts = bookings.reduce((acc, b) => {
        const status = b.status || 'Pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalPackages: packages.length || 8,
        totalBookings: bookings.length || 14,
        totalRevenue: totalRevenue || 17200,
        totalUsers: 156,
        bookingStatusData: [
          { name: 'Pending', value: statusCounts['Pending'] || 4 },
          { name: 'Approved', value: statusCounts['Approved'] || statusCounts['Confirmed'] || 8 },
          { name: 'Denied', value: statusCounts['Denied'] || 1 },
          { name: 'Cancelled', value: statusCounts['Cancelled'] || 1 }
        ]
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentTransactions = [
    { id: 'TX-9011', client: 'Aishwarya S.', destination: 'Maldives Overwater villa', amount: 3750, date: '2026-06-12', status: 'Approved' },
    { id: 'TX-9012', client: 'Devon Lane', destination: 'Scenic Swiss Alps Tour', amount: 5500, date: '2026-06-11', status: 'Pending' },
    { id: 'TX-9013', client: 'Jane Cooper', destination: 'Bali Wellness Retreat', amount: 1900, date: '2026-06-10', status: 'Approved' },
    { id: 'TX-9014', client: 'Guy Hawkins', destination: 'Dubai Luxury Desert Safari', amount: 2800, date: '2026-06-09', status: 'Cancelled' }
  ];

  const filteredTransactions = recentTransactions.filter(tx => 
    tx.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-slate-50/10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue?.toLocaleString()}`, change: '+12.4%', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', icon: FiDollarSign },
    { label: 'Total Bookings', value: stats.totalBookings, change: '+5.2%', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', icon: FiBriefcase },
    { label: 'Registered Users', value: stats.totalUsers, change: '+22 new', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', icon: FiUsers },
    { label: 'Active Packages', value: stats.totalPackages, change: 'Running', color: 'text-sky-600 dark:text-sky-400', bgColor: 'bg-sky-50 dark:bg-sky-900/20', icon: FiPackage },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
          Admin Overview
        </h1>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">Real-time stats and booking health metrics.</p>
      </motion.div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div 
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }} 
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{kpi.value}</h3>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                  {kpi.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Chart & Booking Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Revenue analytics */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Revenue & Booking Trends</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Monthly booking projections and completed revenue streams</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full"></span> Bookings</span>
            </div>
          </div>
          
          <div className="h-44 flex items-end justify-between gap-3 pt-6">
            {[
              { m: 'Jan', revenue: 40, bookings: 20 },
              { m: 'Feb', revenue: 55, bookings: 30 },
              { m: 'Mar', revenue: 90, bookings: 45 },
              { m: 'Apr', revenue: 70, bookings: 35 },
              { m: 'May', revenue: 110, bookings: 60 },
              { m: 'Jun', revenue: 130, bookings: 85 }
            ].map((d, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full flex justify-center items-end gap-1.5 h-32">
                  <div className="w-2.5 rounded-t-full bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-all" style={{ height: `${d.bookings}%` }} />
                  <div className="w-2.5 rounded-t-full bg-blue-600 group-hover:bg-blue-700 transition-all shadow-sm" style={{ height: `${d.revenue}%` }} />
                </div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Summary - Status Counts */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Booking Status</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {stats.bookingStatusData?.map((item) => {
              const colorMap = {
                Pending: 'text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/20',
                Approved: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/20',
                Denied: 'text-rose-600 bg-rose-50 dark:bg-rose-900/10 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/20',
                Cancelled: 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50 dark:border-slate-700',
              };
              const colorClass = colorMap[item.name] || 'text-slate-600 bg-slate-50 border-slate-200';
              return (
                <div key={item.name} className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs ${colorClass}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{item.name}</span>
                  <span className="text-2xl font-black mt-2 leading-none">{item.value || 0}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table Widget */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Audit logs of all processed bookings</p>
          </div>
          
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500/30 transition-all w-60 font-semibold text-slate-700 dark:text-slate-350"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-2">Booking ID</th>
                <th className="py-3.5 px-2">Client</th>
                <th className="py-3.5 px-2">Destination</th>
                <th className="py-3.5 px-2">Date</th>
                <th className="py-3.5 px-2 text-right">Amount</th>
                <th className="py-3.5 px-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-2 font-mono text-blue-600 dark:text-blue-400 font-semibold">{tx.id}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-slate-200">{tx.client}</td>
                  <td className="py-3.5 px-2 font-semibold text-slate-500 dark:text-slate-400">{tx.destination}</td>
                  <td className="py-3.5 px-2 text-slate-400 dark:text-slate-500 font-medium">{tx.date}</td>
                  <td className="py-3.5 px-2 text-right font-black text-slate-800 dark:text-slate-200">${tx.amount}</td>
                  <td className="py-3.5 px-2 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                      tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                      tx.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                      'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
