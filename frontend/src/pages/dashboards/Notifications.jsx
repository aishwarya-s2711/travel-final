import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdCheckCircle, MdInfo, MdWarning, MdDeleteOutline, MdDoneAll } from 'react-icons/md';
import api from '../../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications/my');
      setNotifications(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Optimistically update UI
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      // Assuming backend has a bulk read endpoint or we can loop (better bulk endpoint)
      // For now we'll just optimistically update the UI to avoid many requests
      const unread = notifications.filter(n => !n.isRead);
      for (const n of unread) {
        await api.put(`/notifications/${n._id}/read`);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(n => n._id !== id));
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="text-green-500 text-2xl" />;
      case 'warning':
        return <MdWarning className="text-yellow-500 text-2xl" />;
      case 'error':
        return <MdWarning className="text-red-500 text-2xl" />;
      default:
        return <MdInfo className="text-blue-500 text-2xl" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(n => (
        <div key={n} className="bg-white p-6 rounded-2xl border border-gray-200 animate-pulse flex gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
            <MdNotifications className="text-blue-600" /> Notifications
          </h1>
          <p className="text-gray-600">Stay updated on your bookings, payments, and account alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition shadow-sm"
          >
            <MdDoneAll className="text-lg text-blue-600" /> Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-gray-200 text-center shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <MdNotifications className="text-5xl text-blue-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F172A] mb-3">You're all caught up!</h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            We will notify you when there are updates on your account or bookings.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 flex items-start gap-4 transition-colors ${
                notification.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50/80'
              }`}
              onClick={() => !notification.isRead && markAsRead(notification._id)}
            >
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-bold ${notification.isRead ? 'text-gray-800' : 'text-[#0F172A]'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                  {notification.message}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full" title="Unread"></div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification._id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Delete notification"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
