const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName:    { type: String, default: 'TravelGo' },
  companyEmail:   { type: String, default: 'support@travelgo.com' },
  companyPhone:   { type: String, default: '+1 (555) 123-4567' },
  companyAddress: { type: String, default: '123 Travel Street, NY' },
  logo:           { type: String, default: '' },
  emailAlerts:    { type: Boolean, default: true },
  twoFactorAuth:  { type: Boolean, default: false },
  socialLinks:    {
    facebook:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube:   { type: String, default: '' },
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
