import { useState, useEffect } from 'react';
import api from '../../utils/api';
export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    api.get('/admin/settings').then(res => setSettings(res.data)).catch(console.error);
  }, []);
  return <div><h1 className="text-2xl font-bold mb-4">Settings</h1><pre>{JSON.stringify(settings, null, 2)}</pre></div>;
}
