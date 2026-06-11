import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SEO from '../../components/SEO';
import DashboardLayout from '../../components/DashboardLayout';
import { adminState } from '../../utils/adminState';
import api from '../../utils/api';
import {
  FiGrid,
  FiShoppingBag,
  FiMap,
  FiUsers,
  FiStar,
  FiCreditCard,
  FiFileText,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCheck,
  FiX,
  FiSearch,
  FiEye,
  FiDownload,
  FiLock,
  FiFilter
} from 'react-icons/fi';

const sidebarLinks = [
  { path: '/superadmin/dashboard', label: 'Dashboard', icon: FiGrid },
  { path: '/superadmin/dashboard/bookings', label: 'Bookings', icon: FiShoppingBag },
  { path: '/superadmin/dashboard/packages', label: 'Packages', icon: FiShoppingBag },
  { path: '/superadmin/dashboard/destinations', label: 'Destinations', icon: FiMap },
  { path: '/superadmin/dashboard/users', label: 'Users', icon: FiUsers },
  { path: '/superadmin/dashboard/reviews', label: 'Reviews', icon: FiStar },
  { path: '/superadmin/dashboard/payments', label: 'Payments', icon: FiCreditCard },
  { path: '/superadmin/dashboard/blogs', label: 'Blogs', icon: FiFileText },
  { path: '/superadmin/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
  { path: '/superadmin/dashboard/notifications', label: 'Notifications', icon: FiBell },
  { path: '/superadmin/dashboard/settings', label: 'Settings', icon: FiSettings }
];

export default function SuperAdminDashboard() {
  // Initialize data on mount
  useEffect(() => {
    adminState.init();
  }, []);

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <SEO title="Admin Console | TravelGo" />
      <Routes>
        <Route index element={<Overview />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="packages" element={<PackagesManagement />} />
        <Route path="destinations" element={<DestinationsManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="blogs" element={<BlogsManagement />} />
        <Route path="analytics" element={<AnalyticsReports />} />
        <Route path="notifications" element={<NotificationCenterPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERVIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function Overview() {
  const [data, setData] = useState({ bookings: [], users: [], packages: [], payments: [] });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/bookings').catch(() => ({ data: [] })),
      api.get('/users').catch(() => ({ data: [] })),
      api.get('/packages').catch(() => ({ data: [] })),
      api.get('/payments').catch(() => ({ data: [] })),
    ]).then(([bRes, uRes, pRes, payRes]) => {
      setData({
        bookings: bRes.data?.bookings || bRes.data || [],
        users: uRes.data?.users || uRes.data || [],
        packages: pRes.data?.packages || pRes.data || [],
        payments: payRes.data?.payments || payRes.data || [],
      });
    });
  }, []);

  const totalRevenue = (data.payments || [])
    .filter(p => p.status === 'Success' || p.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + (curr.amount || curr.totalAmount || 0), 0);

  const pendingCount = data.bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = data.bookings.filter(b => b.status === 'Confirmed').length;
  const cancelledCount = data.bookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Platform-wide statistics and activity summary.</p>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-blue-600', border: 'border-t-blue-500', desc: 'Successful transactions' },
          { label: 'Total Bookings', value: data.bookings.length, color: 'text-sky-600', border: 'border-t-sky-500', desc: 'All bookings created' },
          { label: 'Registered Users', value: data.users.length, color: 'text-emerald-600', border: 'border-t-emerald-500', desc: 'Active platform members' },
          { label: 'Tour Packages', value: data.packages.length, color: 'text-purple-600', border: 'border-t-purple-500', desc: 'Active tour listings' }
        ].map((stat, idx) => (
          <div key={idx} className={`modern-card bg-white p-6 border-t-4 ${stat.border}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
            <p className="text-xs text-slate-500 mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Booking Status Sub-distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="modern-card bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Status Allocation</h3>
          <div className="space-y-4">
            {[
              { label: 'Confirmed', count: confirmedCount, color: 'bg-blue-600', text: 'text-blue-600', pct: data.bookings.length ? (confirmedCount / data.bookings.length) * 100 : 0 },
              { label: 'Pending Request', count: pendingCount, color: 'bg-amber-400', text: 'text-amber-500', pct: data.bookings.length ? (pendingCount / data.bookings.length) * 100 : 0 },
              { label: 'Cancelled / Rejected', count: cancelledCount, color: 'bg-rose-500', text: 'text-rose-500', pct: data.bookings.length ? (cancelledCount / data.bookings.length) * 100 : 0 }
            ].map(status => (
              <div key={status.label}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">{status.label} ({status.count})</span>
                  <span className={status.text}>{Math.round(status.pct)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className={`${status.color} h-2 rounded-full`} style={{ width: `${status.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Interactive Revenue YTD Charts (CSS Bars) */}
        <div className="lg:col-span-2 modern-card bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of gross booking profits.</p>
            </div>
            <select className="border border-slate-200 rounded-lg text-xs p-1.5 focus:outline-none" aria-label="Select revenue year">
              <option>Year 2026</option>
              <option>Year 2025</option>
            </select>
          </div>
          <div className="h-44 flex items-end justify-between gap-4 px-2">
            {[
              { m: 'Jan', val: 18000 },
              { m: 'Feb', val: 24000 },
              { m: 'Mar', val: 22000 },
              { m: 'Apr', val: 32000 },
              { m: 'May', val: 39000 },
              { m: 'Jun', val: 45000 },
              { m: 'Jul', val: 49980 },
              { m: 'Aug', val: 56000 }
            ].map((d, i) => {
              const height = (d.val / 60000) * 100;
              return (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      ${d.val.toLocaleString()}
                    </div>
                    <div
                      className="w-full bg-blue-100 dark:bg-blue-950 group-hover:bg-blue-600 transition-colors rounded-t"
                      style={{ height: `${height}%`, minHeight: '6px' }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-800">
                    {d.m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities & Bookings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 modern-card bg-white">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Platform Bookings</h3>
            <button onClick={() => navigate('/superadmin/dashboard/bookings')} className="text-xs font-semibold text-blue-600 hover:underline">
              View All Bookings
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Destination Tour</th>
                  <th className="px-6 py-3 font-semibold">Value</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.bookings.slice(0, 4).map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{b.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.tour}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-950">${b.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`badge text-[10px] ${
                        b.status === 'Confirmed' ? 'badge-primary bg-emerald-50 text-emerald-600' :
                        b.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modern-card bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Recent Notifications Log</h3>
          <div className="space-y-4">
            {adminState.getNotifications().slice(0, 3).map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-600'}`} />
                <div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/superadmin/dashboard/notifications')} className="w-full text-center text-xs font-semibold text-blue-600 hover:underline mt-4">
            Check All Logs
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BOOKING MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    api.get('/bookings')
      .then(r => setBookings(r.data?.bookings || r.data || []))
      .catch(() => setBookings(adminState.getBookings()))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Poll for new bookings every 30s so admin sees live updates
  useEffect(() => {
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
      if (selectedBooking && (selectedBooking._id === id || selectedBooking.id === id)) {
        setSelectedBooking(prev => ({ ...prev, status }));
      }
    } catch (err) {
      // Fallback to adminState
      const updated = adminState.updateBookingStatus(id, status);
      setBookings(updated);
      toast.success(`Booking status updated to ${status}`);
    }
  };

  const exportReport = () => {
    // Generate simulated CSV file download
    const headers = ['Booking ID', 'User', 'Tour', 'Date', 'Persons', 'Amount', 'Status'];
    const rows = bookings.map(b => [
      b.bookingId || b._id || b.id,
      b.user?.name || b.user || b.customerName || '',
      b.package?.title || b.package || b.packageName || b.tour || '',
      b.travelDate || b.date || '',
      b.persons || b.travelers || '',
      b.totalAmount || b.amount || '',
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `booking_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Simulated Excel CSV Report generated and downloaded!');
  };

  const getBookingId = b => b.bookingId || b._id || b.id || '';
  const getCustomerName = b => b.user?.name || b.user || b.customerName || 'N/A';
  const getPackageName = b => b.package?.title || b.package || b.packageName || b.tour || 'N/A';
  const getDate = b => {
    const d = b.travelDate || b.date;
    if (!d) return 'N/A';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };
  const getAmount = b => b.totalAmount || b.amount || 0;

  const filtered = bookings.filter(b => {
    const bId = getBookingId(b).toLowerCase();
    const cName = getCustomerName(b).toLowerCase();
    const pName = getPackageName(b).toLowerCase();
    const matchesSearch = cName.includes(searchTerm.toLowerCase()) || pName.includes(searchTerm.toLowerCase()) || bId.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
          <p className="text-xs text-slate-500 mt-1">Review, filter, approve, and export tour bookings.</p>
        </div>
        <button onClick={exportReport} className="btn btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiDownload size={14} /> Export CSV Report
        </button>
      </div>

      {/* Toolbar */}
      <div className="modern-card bg-white p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg px-3 py-2 w-full max-w-sm">
          <FiSearch className="text-slate-400" size={16} />
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full"
            aria-label="Search bookings"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1"><FiFilter size={12} /> Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs p-2 bg-white focus:outline-none"
            aria-label="Filter bookings by status"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="modern-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Tour Package</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Value</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">Loading bookings...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No bookings found.</td></tr>
              )}
              {filtered.map(b => (
                <tr key={b._id || b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{getBookingId(b)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{getCustomerName(b)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{getPackageName(b)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{getDate(b)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-950">${getAmount(b).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-[10px] ${
                      b.status === 'Confirmed' ? 'badge-primary bg-emerald-50 text-emerald-600' :
                      b.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="View details"
                      >
                        <FiEye size={16} />
                      </button>
                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(b._id || b.id, 'Confirmed')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve Booking"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b._id || b.id, 'Cancelled')}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Reject Booking"
                          >
                            <FiX size={16} />
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id || b.id, 'Cancelled')}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Cancel Booking"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl"
            >
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">Booking Reference #{selectedBooking.id}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">Details and status log</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-900">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Customer Name</span>
                    <strong className="text-slate-900">{selectedBooking.user}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Travel Date</span>
                    <span className="font-semibold text-slate-800">{selectedBooking.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-400 block">Tour Selected</span>
                    <span className="font-semibold text-slate-800">{selectedBooking.tour}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Number of Persons</span>
                    <span className="font-bold text-slate-800">{selectedBooking.persons}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Total Fare Paid</span>
                    <strong className="text-blue-600">${selectedBooking.amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Current Status</span>
                    <span className={`inline-block badge text-[10px] mt-1 ${
                      selectedBooking.status === 'Confirmed' ? 'badge-primary bg-emerald-50 text-emerald-600' :
                      selectedBooking.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                  {selectedBooking.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                        className="btn bg-emerald-600 text-white text-xs py-2 hover:bg-emerald-700"
                      >
                        Approve Booking
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                        className="btn bg-rose-600 text-white text-xs py-2 hover:bg-rose-700"
                      >
                        Reject Request
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                      className="btn bg-rose-600 text-white text-xs py-2 hover:bg-rose-700"
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button onClick={() => setSelectedBooking(null)} className="btn btn-outline text-xs py-2">
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TOUR PACKAGE MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function PackagesManagement() {
  const [packages, setPackages] = useState(() => adminState.getPackages());
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Package Form State
  const [form, setForm] = useState({
    title: '', destination: '', type: 'International', price: 1000,
    originalPrice: 1200, duration: '5D/4N', seats: 10, category: 'International',
    image: '', featured: false, highlights: '', inclusions: ''
  });

  const openEdit = (pkg) => {
    setSelectedPkg(pkg);
    setForm({
      ...pkg,
      highlights: pkg.highlights ? pkg.highlights.join(', ') : '',
      inclusions: pkg.inclusions ? pkg.inclusions.join(', ') : ''
    });
    setIsEditing(true);
  };

  const openAdd = () => {
    setForm({
      title: '', destination: '', type: 'International', price: 1000,
      originalPrice: 1200, duration: '5D/4N', seats: 10, category: 'International',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80', featured: false,
      highlights: '', inclusions: ''
    });
    setIsAdding(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const prepared = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      seats: Number(form.seats),
      highlights: form.highlights.split(',').map(s => s.trim()).filter(Boolean),
      inclusions: form.inclusions.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (isEditing) {
      const updated = adminState.editPackage({ ...selectedPkg, ...prepared });
      setPackages(updated);
      toast.success('Tour package details successfully updated');
      setIsEditing(false);
    } else {
      const updated = adminState.addPackage(prepared);
      setPackages(updated);
      toast.success('New tour package created successfully');
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this package?')) {
      const updated = adminState.deletePackage(id);
      setPackages(updated);
      toast.success('Tour package successfully deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tour Packages</h1>
          <p className="text-xs text-slate-500 mt-1">Add, update, or remove TravelGo packages.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiPlus size={16} /> Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="modern-card bg-white overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                  {pkg.type}
                </div>
                {pkg.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-1">{pkg.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{pkg.destination}</p>
                <div className="flex justify-between items-center mt-4 text-xs font-semibold text-slate-500">
                  <span>Seats: <strong className="text-slate-850">{pkg.seats}</strong></span>
                  <span>Duration: <strong className="text-slate-850">{pkg.duration}</strong></span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-blue-600">${pkg.price}</span>
                  {pkg.originalPrice && <span className="text-xs text-slate-400 line-through">${pkg.originalPrice}</span>}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
              <button onClick={() => openEdit(pkg)} className="btn bg-blue-50 text-blue-600 text-xs py-2 hover:bg-blue-100 flex-1 flex justify-center gap-1.5 items-center">
                <FiEdit size={12} /> Edit Details
              </button>
              <button onClick={() => handleDelete(pkg.id)} className="btn bg-rose-50 text-rose-600 text-xs py-2 hover:bg-rose-100 p-2.5 rounded-lg" title="Delete package">
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isEditing || isAdding) && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden my-8"
            >
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-bold text-slate-900">{isEditing ? 'Edit Tour Package' : 'Create Tour Package'}</h3>
                <button onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-slate-400 hover:text-slate-900">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Package Title</label>
                    <input
                      type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Destination Location</label>
                    <input
                      type="text" required value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Type / Category</label>
                    <select
                      value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: e.target.value })}
                      className="form-input text-sm p-2.5"
                    >
                      <option>International</option>
                      <option>Domestic</option>
                      <option>Romance</option>
                      <option>Family</option>
                      <option>Group</option>
                      <option>Adventure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Selling Price ($)</label>
                    <input
                      type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      className="form-input text-sm p-2.5" min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Original Price ($)</label>
                    <input
                      type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                      className="form-input text-sm p-2.5" min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Duration Tag</label>
                    <input
                      type="text" required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Available Seats</label>
                    <input
                      type="number" required value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })}
                      className="form-input text-sm p-2.5" min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
                    <input
                      type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Highlights (comma separated)</label>
                    <input
                      type="text" value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Inclusions (comma separated)</label>
                    <input
                      type="text" value={form.inclusions} onChange={e => setForm({ ...form, inclusions: e.target.value })}
                      className="form-input text-sm p-2.5" placeholder=""
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      id="featured" type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-slate-600 select-none">Mark package as Featured on homepage</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="btn btn-outline text-xs">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs">
                    {isEditing ? 'Save Changes' : 'Create Package'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DESTINATION MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function DestinationsManagement() {
  const [destinations, setDestinations] = useState(() => adminState.getDestinations());
  const [selectedDest, setSelectedDest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', country: '', image: '', description: '', bestTime: '', attractions: '' });

  const openEdit = (dest) => {
    setSelectedDest(dest);
    setForm({
      ...dest,
      attractions: dest.attractions ? dest.attractions.join(', ') : ''
    });
    setIsEditing(true);
  };

  const openAdd = () => {
    setForm({ name: '', country: '', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&fit=crop&auto=format', description: '', bestTime: 'Apr-Oct', attractions: '' });
    setIsAdding(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const prepared = {
      ...form,
      attractions: form.attractions.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (isEditing) {
      const updated = adminState.editDestination({ ...selectedDest, ...prepared });
      setDestinations(updated);
      toast.success('Destination updated successfully');
      setIsEditing(false);
    } else {
      const updated = adminState.addDestination(prepared);
      setDestinations(updated);
      toast.success('Destination added successfully');
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this destination?')) {
      const updated = adminState.deleteDestination(id);
      setDestinations(updated);
      toast.success('Destination deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destination Management</h1>
          <p className="text-xs text-slate-500 mt-1">Review and manage travel spots and information.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiPlus size={16} /> Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map(dest => (
          <div key={dest.id} className="modern-card bg-white overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="h-36 overflow-hidden relative bg-slate-100">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 leading-snug">{dest.name}</h3>
                <span className="text-xs text-slate-400 block mt-0.5">{dest.country}</span>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{dest.description}</p>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-500 mt-3 inline-block">Best: {dest.bestTime}</span>
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 border-t border-slate-50 flex gap-2">
              <button onClick={() => openEdit(dest)} className="btn bg-blue-50 text-blue-600 text-xs py-2 hover:bg-blue-100 flex-1 flex justify-center gap-1 items-center">
                <FiEdit size={12} /> Edit
              </button>
              <button onClick={() => handleDelete(dest.id)} className="btn bg-rose-50 text-rose-600 hover:bg-rose-100 py-2 p-2.5 rounded-lg">
                <FiTrash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {(isEditing || isAdding) && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
            >
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-bold text-slate-900">{isEditing ? 'Edit Destination' : 'Add Destination'}</h3>
                <button onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-slate-400 hover:text-slate-900">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Destination Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Country</label>
                    <input type="text" required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
                    <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Best Season to Visit</label>
                    <input type="text" value={form.bestTime} onChange={e => setForm({ ...form, bestTime: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Top Attractions (comma separated)</label>
                    <input type="text" value={form.attractions} onChange={e => setForm({ ...form, attractions: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Brief Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="btn btn-outline text-xs">Cancel</button>
                  <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs">{isEditing ? 'Save Changes' : 'Create Destination'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. USER MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function UsersManagement() {
  const [users, setUsers] = useState(() => adminState.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggleBlock = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Blocked' ? 'Active' : 'Blocked';
    const updated = adminState.updateUserStatus(id, nextStatus);
    setUsers(updated);
    toast.success(`User state successfully set to ${nextStatus}`);
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(prev => ({ ...prev, status: nextStatus }));
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete user profile completely from records?')) {
      const updated = adminState.deleteUser(id);
      setUsers(updated);
      toast.success('User deleted successfully');
      setSelectedUser(null);
    }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review user activity, modify blocking state, or remove profiles.</p>
      </div>

      <div className="modern-card bg-white p-4">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-lg px-3 py-2 w-full max-w-sm">
          <FiSearch className="text-slate-400" size={16} />
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs focus:outline-none w-full"
            aria-label="Search users"
          />
        </div>
      </div>

      <div className="modern-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">User Profile</th>
                <th className="px-6 py-3 font-semibold">Contact Email</th>
                <th className="px-6 py-3 font-semibold">Member Since</th>
                <th className="px-6 py-3 font-semibold">Bookings</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.joinDate}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-950">{u.bookings}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-[10px] ${
                      u.status === 'Active' ? 'badge-primary bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setSelectedUser(u)} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded" title="View Profile">
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => handleToggleBlock(u.id, u.status)} className={`p-1 rounded text-xs px-2 font-semibold ${
                        u.status === 'Blocked' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}>
                        {u.status === 'Blocked' ? 'Unblock' : 'Block'}
                      </button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded" title="Delete User">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Member profile details</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-900"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-2">
                    {selectedUser.name[0]}
                  </div>
                  <h4 className="font-bold text-lg text-slate-900">{selectedUser.name}</h4>
                  <span className="text-xs text-slate-400">{selectedUser.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-50">
                  <div>
                    <span className="text-slate-400 block">Phone Contact</span>
                    <strong className="text-slate-900 text-xs">{selectedUser.phone || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Tours Booked</span>
                    <strong className="text-slate-900 text-xs">{selectedUser.bookings}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Registered On</span>
                    <span className="text-slate-800">{selectedUser.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Profile Status</span>
                    <span className={`inline-block badge text-[10px] mt-1 ${selectedUser.status === 'Active' ? 'badge-primary bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{selectedUser.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                  <button onClick={() => handleToggleBlock(selectedUser.id, selectedUser.status)} className="btn bg-amber-50 text-amber-600 text-xs py-2 hover:bg-amber-100">{selectedUser.status === 'Blocked' ? 'Activate User' : 'Block User'}</button>
                  <button onClick={() => handleDeleteUser(selectedUser.id)} className="btn bg-rose-50 text-rose-600 text-xs py-2 hover:bg-rose-100">Delete User Account</button>
                  <button onClick={() => setSelectedUser(null)} className="btn btn-outline text-xs py-2">Dismiss</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REVIEW MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ReviewsManagement() {
  const [reviews, setReviews] = useState(() => adminState.getReviews());
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleUpdateReviewStatus = (id, approved) => {
    const updated = adminState.updateReviewStatus(id, approved);
    setReviews(updated);
    toast.success(approved ? 'Review approved successfully' : 'Review set to rejected status');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete review permanently?')) {
      const updated = adminState.deleteReview(id);
      setReviews(updated);
      toast.success('Review deleted');
    }
  };

  const handleReplySubmit = (e, id) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const updated = adminState.replyToReview(id, replyText);
    setReviews(updated);
    toast.success('Reply added to review');
    setActiveReply(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review feedback, filter spam, and reply directly.</p>
      </div>

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="modern-card bg-white p-6 space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="flex gap-3 items-center">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{r.location} | Tour: <strong className="text-slate-600">{r.tour}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 italic leading-relaxed">"{r.comment}"</p>

            {r.reply && (
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <strong className="text-blue-600">TravelGo Response:</strong>
                <p className="text-slate-600 italic">"{r.reply}"</p>
              </div>
            )}

            <div className="flex gap-2 justify-between items-center border-t border-slate-50 pt-4 flex-wrap">
              <div className="flex gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                  r.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {r.status || 'Pending Review'}
                </span>
              </div>
              <div className="flex gap-2">
                {r.status !== 'Approved' && (
                  <button onClick={() => handleUpdateReviewStatus(r.id, true)} className="btn bg-emerald-50 text-emerald-600 text-xs py-1.5 hover:bg-emerald-100 px-3">
                    Approve
                  </button>
                )}
                {r.status !== 'Rejected' && (
                  <button onClick={() => handleUpdateReviewStatus(r.id, false)} className="btn bg-rose-50 text-rose-600 text-xs py-1.5 hover:bg-rose-100 px-3">
                    Reject
                  </button>
                )}
                {!r.reply && (
                  <button onClick={() => { setActiveReply(r.id); setReplyText(''); }} className="btn bg-blue-50 text-blue-600 text-xs py-1.5 hover:bg-blue-100 px-3">
                    Reply
                  </button>
                )}
                <button onClick={() => handleDelete(r.id)} className="btn bg-slate-50 hover:bg-slate-100 p-2 text-slate-500 rounded-lg">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>

            {/* Reply Dialog */}
            {activeReply === r.id && (
              <form onSubmit={(e) => handleReplySubmit(e, r.id)} className="pt-2 flex gap-2">
                <input
                  type="text" required value={replyText} onChange={e => setReplyText(e.target.value)}
                  className="form-input text-xs p-2.5 flex-1" placeholder=""
                  aria-label="Reply to review"
                />
                <button type="submit" className="btn btn-primary bg-blue-600 text-xs px-4">Submit</button>
                <button type="button" onClick={() => setActiveReply(null)} className="btn btn-outline text-xs">Cancel</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PAYMENT MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function PaymentsManagement() {
  const [payments] = useState(() => adminState.getPayments());
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Transactions</h1>
        <p className="text-xs text-slate-500 mt-1">Audit platform revenue, success rates, and print invoices.</p>
      </div>

      <div className="modern-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Txn Reference</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Amount Paid</th>
                <th className="px-6 py-3 font-semibold">Payment Channel</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Date Completed</th>
                <th className="px-6 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400">{p.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{p.user}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-950">${p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-[10px] ${
                      p.status === 'Success' ? 'badge-primary bg-emerald-50 text-emerald-600' :
                      p.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => setSelectedInvoice(p)} className="btn bg-blue-50 text-blue-600 text-xs py-1 px-3 hover:bg-blue-100">
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">TravelGo Official Invoice</h3>
                  <span className="text-[10px] text-slate-400">Transaction ID: {selectedInvoice.id}</span>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-900"><FiX size={20} /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Name:</span>
                  <strong className="text-slate-900">{selectedInvoice.user}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completed Date:</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Channel:</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference Booking ID:</span>
                  <span className="font-mono text-slate-800">{selectedInvoice.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className={`badge text-[9px] ${selectedInvoice.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{selectedInvoice.status}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-100 pt-3 text-sm">
                  <span className="font-bold text-slate-900">Total Charged:</span>
                  <strong className="text-blue-600">${selectedInvoice.amount.toLocaleString()}</strong>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button onClick={() => { window.print(); }} className="btn btn-primary bg-blue-600 text-xs py-2 hover:bg-blue-700">Print / Save Invoice</button>
                <button onClick={() => setSelectedInvoice(null)} className="btn btn-outline text-xs py-2">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. BLOG MANAGEMENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function BlogsManagement() {
  const [blogs, setBlogs] = useState(() => adminState.getBlogs());
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Form State
  const [form, setForm] = useState({ title: '', category: '', excerpt: '', author: '', image: '', content: '', tags: '' });

  const openAdd = () => {
    setForm({ title: '', category: 'Destinations', excerpt: '', author: 'TravelGo Admin', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', content: '', tags: '' });
    setIsAdding(true);
  };

  const openEdit = (post) => {
    setSelectedPost(post);
    setForm({
      ...post,
      tags: post.tags ? post.tags.join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const prepared = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (isEditing) {
      const updated = adminState.editBlog({ ...selectedPost, ...prepared });
      setBlogs(updated);
      toast.success('Blog post details updated successfully');
      setIsEditing(false);
    } else {
      const updated = adminState.addBlog(prepared);
      setBlogs(updated);
      toast.success('Blog post successfully published');
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this blog post?')) {
      const updated = adminState.deleteBlog(id);
      setBlogs(updated);
      toast.success('Blog post successfully removed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-xs text-slate-500 mt-1">Publish, update, or edit rich TravelGo articles.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <FiPlus size={16} /> Compose New Article
        </button>
      </div>

      <div className="modern-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Author</th>
                <th className="px-6 py-3 font-semibold">Publish Date</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {blogs.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.image} alt="" className="w-12 h-8 rounded object-cover" />
                      <div>
                        <span className="text-sm font-semibold text-slate-900 block line-clamp-1">{post.title}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{post.excerpt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{post.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{post.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(post)} className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded">
                        <FiEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {(isEditing || isAdding) && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                <h3 className="font-bold text-slate-900">{isEditing ? 'Compose / Edit Post' : 'Compose Blog Post'}</h3>
                <button onClick={() => { setIsEditing(false); setIsAdding(false); }} className="text-slate-400 hover:text-slate-900"><FiX size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Article Title</label>
                    <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <input type="text" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Author Name</label>
                    <input type="text" required value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="form-input text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Featured Cover Image URL</label>
                    <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="form-input text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Tags (comma separated)</label>
                    <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Summary / Excerpt</label>
                    <input type="text" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="form-input text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Article Content (Markdown / Text)</label>
                    <textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="form-input text-sm" placeholder="" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => { setIsEditing(false); setIsAdding(false); }} className="btn btn-outline text-xs">Cancel</button>
                  <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs">Publish Article</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ANALYTICS & REPORTS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function AnalyticsReports() {
  const downloadReport = (type) => {
    toast.info(`Generating ${type} report download packet...`);
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      toast.success(`${type} Report successfully downloaded!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics and Reports</h1>
        <p className="text-xs text-slate-500 mt-1">Platform metrics logs, growth tables, and data exports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="modern-card bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Popular Travel Locations (YTD)</h3>
          <div className="space-y-3">
            {[
              { dest: 'Santorini, Greece', pct: 85, bookings: 128 },
              { dest: 'Maldives', pct: 72, bookings: 95 },
              { dest: 'Bali, Indonesia', pct: 64, bookings: 78 },
              { dest: 'Swiss Alps', pct: 55, bookings: 64 }
            ].map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{d.dest}</span>
                  <span className="text-blue-600">{d.bookings} Bookings</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${d.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modern-card bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">User Growth Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Organic Search Visitors', count: '14,890', growth: '+12.4%' },
              { label: 'Registered Customer Accounts', count: '1,280', growth: '+18.9%' },
              { label: 'Partner Agency Profiles', count: '42', growth: '+5.0%' },
              { label: 'Booking Checkout Conversion', count: '3.82%', growth: '+1.5%' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-slate-50">
                <span className="font-medium text-slate-600">{item.label}</span>
                <div className="text-right">
                  <strong className="text-slate-900 block">{item.count}</strong>
                  <span className="text-emerald-600 text-[10px] font-bold">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="modern-card bg-white p-6">
        <h3 className="font-bold text-slate-900 mb-4">Download PDF/Excel Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Annual Financial Audit', format: 'PDF Document', icon: FiFileText },
            { title: 'User Registration Growth', format: 'Excel Sheet', icon: FiBarChart2 },
            { title: 'Tour Package Popularity Index', format: 'CSV Data Packet', icon: FiGrid }
          ].map((r, i) => (
            <div key={i} className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between items-start space-y-4">
              <div>
                <r.icon className="text-blue-600" size={24} />
                <h4 className="font-bold text-slate-900 text-sm mt-2">{r.title}</h4>
                <span className="text-[10px] text-slate-400 mt-1 block">{r.format}</span>
              </div>
              <button onClick={() => downloadReport(r.title)} className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs py-2 w-full flex items-center justify-center gap-1.5">
                <FiDownload size={12} /> Download Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. NOTIFICATION CENTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function NotificationCenterPage() {
  const [notifications, setNotifications] = useState(() => adminState.getNotifications());

  const handleMarkAllRead = () => {
    const updated = adminState.markAllNotificationsRead();
    setNotifications(updated);
    toast.success('All notifications marked as read');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notification Logs</h1>
          <p className="text-xs text-slate-500 mt-1">Check critical checkout activities and account setups.</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 py-2">
          Mark All as Read
        </button>
      </div>

      <div className="modern-card bg-white divide-y divide-slate-100">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 flex items-start gap-4 transition-colors ${n.read ? 'opacity-85' : 'bg-blue-50/20'}`}>
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-300' : 'bg-blue-600'}`} />
            <div className="flex-1">
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{n.text}</p>
              <span className="text-xs text-slate-400 block mt-1">{n.date}</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded shrink-0">
              {n.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. SETTINGS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [settings, setSettings] = useState(() => adminState.getSettings());

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleSaveSettings = (e) => {
    e.preventDefault();
    adminState.saveSettings(settings);
    toast.success('Agency settings saved successfully');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Admin security passphrase updated successfully');
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure company profiles, contact handles, or security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 modern-card bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Agency Information</h3>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Registered Name</label>
                <input
                  type="text" value={settings.companyName} onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Email</label>
                <input
                  type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">HQ Address</label>
                <input
                  type="text" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Facebook Handle</label>
                <input
                  type="text" value={settings.socialFacebook} onChange={e => setSettings({ ...settings, socialFacebook: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Instagram Handle</label>
                <input
                  type="text" value={settings.socialInstagram} onChange={e => setSettings({ ...settings, socialInstagram: e.target.value })}
                  className="form-input text-sm p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs px-5">
                Save Settings Configuration
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="modern-card bg-white p-6">
            <h3 className="font-bold text-slate-900 mb-4">Security Passphrase</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Current Password</label>
                <input
                  type="password" required value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">New Password</label>
                <input
                  type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Confirm New Password</label>
                <input
                  type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
              <button type="submit" className="btn btn-primary bg-blue-600 text-xs w-full py-2 hover:bg-blue-700 flex justify-center gap-1">
                <FiLock size={12} /> Update Security Code
              </button>
            </form>
          </div>

          <div className="modern-card bg-white p-6 space-y-4">
            <h3 className="font-bold text-slate-900">System Preferences</h3>
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifs" className="text-xs font-semibold text-slate-600">Email Alerts</label>
              <input
                id="email-notifs" type="checkbox" checked={settings.enableEmailNotifications} onChange={e => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="mfa" className="text-xs font-semibold text-slate-600">2FA Security</label>
              <input
                id="mfa" type="checkbox" checked={settings.enableMfa} onChange={e => setSettings({ ...settings, enableMfa: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
