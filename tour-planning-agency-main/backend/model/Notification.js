const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type:    { type: String, enum: ['Booking', 'Payment', 'Registration', 'System'], required: true },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  data:    { type: mongoose.Schema.Types.Mixed },
  read:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
