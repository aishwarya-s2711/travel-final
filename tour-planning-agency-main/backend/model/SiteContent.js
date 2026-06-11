const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
  bio: { type: String }
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
}, { timestamps: true });

const statSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  label: { type: String, required: true },
  suffix: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  Team: mongoose.model('Team', teamSchema),
  FAQ: mongoose.model('FAQ', faqSchema),
  Stat: mongoose.model('Stat', statSchema),
};
