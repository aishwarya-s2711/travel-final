const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:      { type: String, default: '' },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:     { type: String, default: '' },
  wishlist:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });

// Hash password before save — bcryptjs v3 returns a Promise, no callback
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare plain password against stored hash
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
