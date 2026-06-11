const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking:       { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:        { type: Number, required: true },
  method:        { type: String, enum: ['Card', 'UPI', 'Bank Transfer', 'Cash'], default: 'Card' },
  transactionId: { type: String, required: true, unique: true },
  status:        { type: String, enum: ['Success', 'Pending', 'Failed', 'Refunded'], default: 'Success' },
  invoiceNumber: { type: String },
}, { timestamps: true });

// Auto-generate invoiceNumber
paymentSchema.pre('save', async function () {
  if (!this.invoiceNumber && this.status === 'Success') {
    this.invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
