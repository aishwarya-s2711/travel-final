const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  excerpt:  { type: String },
  category: { type: String },
  image:    { type: String },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:     [{ type: String }],
  comments: [{ user: String, text: String, date: { type: Date, default: Date.now } }],
  views:    { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking:    { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  package:    { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true },
  images:     [{ type: String }],
  adminReply: { type: String, default: '' },
  repliedAt:  { type: Date },
}, { timestamps: true });

module.exports = {
  Blog: mongoose.model('Blog', blogSchema),
  Review: mongoose.model('Review', reviewSchema),
};
