import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import SEO from '../../components/SEO';
import { FiGrid, FiPackage, FiCalendar, FiUsers, FiSettings, FiMessageSquare } from 'react-icons/fi';
import api from '../../utils/api';

const links = [
  { path: '/agency/dashboard', label: 'Overview', icon: FiGrid },
  { path: '/agency/dashboard/packages', label: 'Packages', icon: FiPackage },
  { path: '/agency/dashboard/bookings', label: 'Bookings', icon: FiCalendar },
  { path: '/agency/dashboard/customers', label: 'Customers', icon: FiUsers },
  { path: '/agency/dashboard/messages', label: 'Messages', icon: FiMessageSquare },
  { path: '/agency/dashboard/settings', label: 'Settings', icon: FiSettings },
];

function Overview() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings').then(r => setBookings(r.data?.bookings || r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Agency Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Packages', value: '12', color: 'text-primary', bg: 'bg-indigo-50' },
          { label: 'Total Bookings', value: '148', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'New Messages', value: '5', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Revenue', value: '$24.5k', color: 'text-slate-900', bg: 'bg-slate-100' }
        ].map(s => (
          <div key={s.label} className="modern-card p-5">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <h3 className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      <div className="modern-card">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Tour</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b, i) => (
                <tr key={b._id || b.id || i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{b.bookingId || b._id || b.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{b.user?.name || b.user || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{b.package?.title || b.tour || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">${(b.totalAmount || b.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`badge ${b.status === 'Confirmed' ? 'badge-primary bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {b.status}
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

function Placeholder({ title }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <div className="modern-card p-12 text-center">
        <p className="text-slate-500">Module under development.</p>
      </div>
    </div>
  );
}

export default function AgencyDashboard() {
  return (
    <DashboardLayout sidebarLinks={links}>
      <SEO title="Agency Dashboard | TravelGo" />
      <Routes>
        <Route index element={<Overview />} />
        <Route path="packages" element={<Placeholder title="Manage Packages" />} />
        <Route path="bookings" element={<Placeholder title="Manage Bookings" />} />
        <Route path="customers" element={<Placeholder title="Customers" />} />
        <Route path="messages" element={<Placeholder title="Messages" />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
      </Routes>
    </DashboardLayout>
  );
}
