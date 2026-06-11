const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package:       { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // Optional - for when package exists in DB
  packageId:     { type: Number }, // Store numeric ID for dummy data packages
  packageName:   { type: String }, // Store package name as fallback
  destination:   { type: String },
  travelers:     [{ name: String, age: Number, passport: String }],
  persons:       { type: Number, required: true, min: 1 },
  travelDate:    { type: Date, required: true },
  totalAmount:   { type: Number, required: true },
  packagePrice:  { type: Number, default: 0 },
  additionalCharges: { type: Number, default: 0 },
  status:        { type: String, enum: ['Pending','Approved','Denied','Cancelled','Completed'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid','Paid','Refunded'], default: 'Unpaid' },
  paymentId:     { type: String, default: '' },
  bookingId:     { type: String, unique: true },
  specialReq:    { type: String, default: '' },
  tripStatus:    { type: String, enum: ['Scheduled','In Transit','Arriving','Completed'], default: 'Scheduled' },
  reviewSubmitted: { type: Boolean, default: false },
}, { timestamps: true });

bookingSchema.pre('save', async function () {
  if (!this.bookingId) {
    this.bookingId = 'TG' + Date.now().toString().slice(-8);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
