import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdSave, MdEdit } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const UserProfile = () => {
  const { user, login } = useAuth(); // login is usually used to update the context state
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await api.put('/users/profile', formData);
      // Update local storage and context if necessary
      if (response.data && response.data.user) {
        // Assuming your backend returns the updated user and optionally a token
        const updatedUser = response.data.user;
        const currentToken = localStorage.getItem('token');
        login(updatedUser, currentToken); // update the context with new user info
      }
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ text: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-blue-600">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">{user?.name}</h2>
              <p className="text-gray-500">{user?.role?.toUpperCase() || 'USER'}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <><MdEdit /> Edit Profile</>
            )}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPerson className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400 text-lg" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing} // Often emails shouldn't be editable directly without verification, but we allow it for now
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPhone className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder=""
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLocationOn className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-lg shadow-blue-200 disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <MdSave className="text-xl" />
                )}
                Save Changes
              </motion.button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
