import { useState, useEffect } from 'react';
import { FiBell, FiX, FiCheck } from 'react-icons/fi';
import api from '../utils/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/user');
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <FiBell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map(notif => (
                    <div
                      key={notif._id}
                      className={`p-4 hover:bg-slate-50 transition-colors ${
                        !notif.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notif.read ? 'bg-blue-600' : 'bg-slate-300'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900">
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif._id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Mark as read"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
