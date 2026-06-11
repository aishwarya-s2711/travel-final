import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdHelp, MdEmail, MdPhone, MdSend, MdChat } from 'react-icons/md';
import api from '../../utils/api';

const Support = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      // Could connect to a /api/support endpoint if it exists. 
      // For now, we simulate a success message
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setMsg({ text: 'Your message has been sent to our support team. We will get back to you shortly.', type: 'success' });
      setFormData({ subject: '', message: '' });
    } catch (err) {
      setMsg({ text: 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-3">
          <MdHelp className="text-blue-600" /> Support & Help Center
        </h1>
        <p className="text-gray-600">Need assistance? We're here to help you with your travel needs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <MdChat className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-6">Chat with our customer service agents in real-time.</p>
            <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#0F172A] mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <MdPhone className="text-xl text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Phone Support</p>
                  <p className="text-gray-600 text-sm mt-1">+1 (800) 123-4567</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MdEmail className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A]">Email Support</p>
                  <p className="text-gray-600 text-sm mt-1">support@travelgo.com</p>
                  <p className="text-gray-500 text-xs mt-1">24/7 Response time: ~2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-6 border-b border-gray-100 pb-4">Send us a Message</h2>
            
            {msg.text && (
              <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
                msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Question</option>
                  <option value="account">Account Management</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Please describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-lg shadow-blue-200 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <MdSend className="text-xl" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
