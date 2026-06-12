import { useState, useEffect } from 'react';
import { FiTrash2, FiMail, FiUser, FiCalendar, FiFileText } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiInfo } from 'react-icons/fi';

export default function InquiriesManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      toast.success('Inquiry deleted');
      fetchInquiries();
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customer Inquiries</h1>
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold text-sm">
          Total Inquiries: {inquiries.length}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <FiInfo className="mx-auto text-4xl text-slate-400 mb-4" />
          <h2 className="text-lg font-bold text-slate-600 dark:text-slate-300">No inquiries yet</h2>
          <p className="text-slate-500">When users submit the contact form, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative group">
              <button
                onClick={() => deleteInquiry(inq._id)}
                className="absolute top-4 right-4 p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                title="Delete Inquiry"
              >
                <FiTrash2 />
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                    <FiUser className="text-slate-400" /> {inq.name}
                  </h3>
                  <a href={`mailto:${inq.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                    <FiMail className="text-blue-400" /> {inq.email}
                  </a>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold mb-2">
                    {inq.subject || 'General Inquiry'}
                  </span>
                  <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
                    <FiCalendar /> {new Date(inq.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <FiFileText /> Message
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  {inq.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
