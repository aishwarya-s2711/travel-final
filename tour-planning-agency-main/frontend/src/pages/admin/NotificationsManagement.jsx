import { useState, useEffect } from 'react';
import api from '../../utils/api';
export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    api.get('/admin/notifications').then(res => setNotifications(res.data)).catch(console.error);
  }, []);
  return <div><h1 className="text-2xl font-bold mb-4">Notifications</h1><div>{notifications.length} notifications loaded</div></div>;
}
