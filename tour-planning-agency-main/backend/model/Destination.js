const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name:          { type: String, required: true, unique: true },
  country:       { type: String, required: true },
  description:   { type: String },
  image:         { type: String },
  featured:      { type: Boolean, default: false },
  active:        { type: Boolean, default: true },
  packageCount:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
