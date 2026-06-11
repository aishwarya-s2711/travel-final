import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiEye, FiTrash2 } from 'react-icons/fi';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}/status`, { isVerified: !currentStatus });
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>User Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage platform users, roles, and account access statuses.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafaf8] text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100/80">
                <th className="px-6 py-4 font-bold">User Identity</th>
                <th className="px-6 py-4 font-bold">Contact Email</th>
                <th className="px-6 py-4 font-bold">Assigned Role</th>
                <th className="px-6 py-4 font-bold">Account Status</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7C3AED] flex items-center justify-center text-[#0f172a] font-bold text-sm flex-shrink-0 shadow-inner">
                        {u.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <p className="text-sm font-bold text-slate-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-600">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-md border ${u.role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${u.isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
                      {u.isVerified && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                      {!u.isVerified && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse"></span>}
                      {u.isVerified ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleBlock(u._id, u.isVerified)} 
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors ${u.isVerified ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                      >
                        {u.isVerified ? 'Block Access' : 'Restore Access'}
                      </button>
                    </div>
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
