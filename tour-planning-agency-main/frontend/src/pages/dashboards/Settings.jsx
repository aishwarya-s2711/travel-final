import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSettings, MdLock, MdNotifications, MdSecurity, MdLanguage, MdSave, MdCheckCircle } from 'react-icons/md';
import api from '../../utils/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  
  // Security state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });

  // Notifications state (dummy)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    promotions: true,
    bookingUpdates: true
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    try {
      setPassLoading(true);
      setPassMsg({ text: '', type: '' });
      await api.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPassMsg({ text: 'Password updated successfully.', type: 'success' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error changing password:', err);
      setPassMsg({ text: err.response?.data?.message || 'Failed to update password.', type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleNotificationSave = () => {
    // In a real app, send to backend
    alert('Notification preferences saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
          <MdSettings className="text-blue-600" /> Account Settings
        </h1>
        <p className="text-gray-600">Manage your security preferences and application settings.</p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'security' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MdSecurity className="text-lg" /> Security
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'notifications' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MdNotifications className="text-lg" /> Notifications
          </button>
          
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === 'preferences' ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MdLanguage className="text-lg" /> Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[900px] w-full mx-auto space-y-6">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2 mb-2">
                  <MdSecurity className="text-blue-600 text-3xl" /> 
                  Security Settings
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Manage your password and account security.
                </p>
              </div>

              {passMsg.text && (
                <div className={`p-4 rounded-xl text-sm font-medium border ${
                  passMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`} role="alert">
                  {passMsg.text}
                </div>
              )}

              {/* Password Form Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 w-full">
                <h3 className="text-lg font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">Update Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                      {passLoading ? 'Saving...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto h-12 px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Features Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8 w-full mt-6">
                <h3 className="text-lg font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">Security Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MdCheckCircle className="text-green-500 text-2xl" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">Strong Password</p>
                      <p className="text-sm text-gray-500">Enabled</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MdSecurity className="text-yellow-500 text-2xl" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">Two-Factor Auth</p>
                      <p className="text-sm text-gray-500">Not Configured</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MdLock className="text-blue-500 text-2xl" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">Last Changed</p>
                      <p className="text-sm text-gray-500">Today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MdLock className="text-purple-500 text-2xl" />
                    <div>
                      <p className="font-semibold text-[#0F172A]">Active Sessions</p>
                      <p className="text-sm text-gray-500">1 Device Connected</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { id: 'emailAlerts', title: 'Email Alerts', desc: 'Receive important updates and security alerts.' },
                  { id: 'smsAlerts', title: 'SMS Notifications', desc: 'Get text messages for booking confirmations.' },
                  { id: 'promotions', title: 'Marketing & Promotions', desc: 'Receive exclusive deals and destination news.' },
                  { id: 'bookingUpdates', title: 'Booking Updates', desc: 'Notifications about your upcoming trips.' }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#0F172A]">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.id)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${notifications[item.id] ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications[item.id] ? 'transform translate-x-6' : ''}`}></div>
                    </button>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={handleNotificationSave}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] hover:bg-gray-800 text-white rounded-xl font-semibold transition"
                  >
                    <MdSave /> Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">Application Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <button
                    onClick={() => alert('Preferences saved!')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] hover:bg-gray-800 text-white rounded-xl font-semibold transition"
                  >
                    <MdSave /> Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Settings;
