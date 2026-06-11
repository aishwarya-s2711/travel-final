const mongoose = require('mongoose');

// Counter schema for auto-incrementing packageId
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const packageSchema = new mongoose.Schema({
  // ── Identity ────────────────────────────────────────────────────────────────
  packageId:    { type: String, unique: true },                // Auto-generated: PKG-1001, PKG-1002, ...
  title:        { type: String, required: true, trim: true },
  destination:  { type: String, required: true, trim: true },
  country:      { type: String, default: '', trim: true },

  // ── Classification ─────────────────────────────────────────────────────────
  category: {
    type: String,
    enum: ['Domestic', 'International', 'Family', 'Adventure', 'Luxury',
           'Pilgrimage', 'Wildlife', 'Beach', 'Hill Station', 'Cultural'],
    default: 'Domestic'
  },
  type: {
    type: String,
    enum: ['Domestic', 'International', 'Honeymoon', 'Family', 'Group', 'Adventure',
           'Luxury', 'Pilgrimage', 'Wildlife', 'Beach', 'Hill Station', 'Cultural'],
    default: 'Domestic'
  },

  // ── Pricing ────────────────────────────────────────────────────────────────
  price:              { type: Number, required: true, min: 0 },
  originalPrice:      { type: Number, min: 0 },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },

  // ── Duration ───────────────────────────────────────────────────────────────
  duration:       { type: String, default: '' },           // Display string: "7D/6N"
  durationDays:   { type: Number, default: 1, min: 1 },
  durationNights: { type: Number, default: 0, min: 0 },

  // ── Availability ───────────────────────────────────────────────────────────
  availableSeats: { type: Number, default: 20, min: 0 },
  travelDates: [{
    startDate: { type: Date },
    endDate:   { type: Date },
    _id: false
  }],

  // ── Images ─────────────────────────────────────────────────────────────────
  coverImage:    { type: String, default: '' },             // Main cover image (URL or base64)
  galleryImages: [{ type: String }],                        // Multiple gallery images
  image:         { type: String, default: '' },             // Legacy field (backward compat)
  images:        [{ type: String }],                        // Legacy field (backward compat)

  // ── Descriptions ───────────────────────────────────────────────────────────
  shortDescription:    { type: String, default: '', maxlength: 500 },
  detailedDescription: { type: String, default: '' },

  // ── Content ────────────────────────────────────────────────────────────────
  highlights: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],

  // ── Day-wise Itinerary ─────────────────────────────────────────────────────
  itinerary: [{
    day:           { type: Number },
    title:         { type: String, default: '' },
    desc:          { type: String, default: '' },         // Legacy compat
    description:   { type: String, default: '' },         // New field
    meals:         { type: String, default: '' },         // e.g. "Breakfast, Lunch"
    accommodation: { type: String, default: '' },         // e.g. "5-Star Resort"
    _id: false
  }],

  // ── Hotel Information ──────────────────────────────────────────────────────
  hotelInfo: [{
    name:      { type: String, default: '' },
    rating:    { type: Number, default: 0 },
    location:  { type: String, default: '' },
    amenities: [{ type: String }],
    _id: false
  }],

  // ── Transport & Meals ──────────────────────────────────────────────────────
  transportInfo: {
    type:    { type: String, default: '' },                // e.g. "AC Volvo Bus + Flight"
    details: { type: String, default: '' }
  },
  mealPlan: { type: String, default: '' },                 // e.g. "MAP (Breakfast + Dinner)"

  // ── Policies ───────────────────────────────────────────────────────────────
  cancellationPolicy:  { type: String, default: '' },
  termsAndConditions:  { type: String, default: '' },

  // ── Toggles & Status ───────────────────────────────────────────────────────
  isFeatured:   { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  status:       { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  isActive:     { type: Boolean, default: true },          // Legacy compat

  // ── Ratings & Reviews ──────────────────────────────────────────────────────
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  reviews:     { type: Number, default: 0 },               // Legacy compat

  // ── Legacy ─────────────────────────────────────────────────────────────────
  badge:     { type: String, default: '' },
  seats:     { type: Number, default: 20 },                // Legacy; use availableSeats
  numericId: { type: Number },
}, { timestamps: true });

// ── Indexes for search & filtering ───────────────────────────────────────────
packageSchema.index({ title: 'text', destination: 'text', country: 'text', shortDescription: 'text' });
packageSchema.index({ category: 1, status: 1 });
packageSchema.index({ isFeatured: 1 });
packageSchema.index({ isBestSeller: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ destination: 1 });

// ── Auto-generate packageId before saving ────────────────────────────────────
packageSchema.pre('save', async function () {
  if (this.isNew && !this.packageId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'packageId',
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
      );
      this.packageId = `PKG-${counter.seq}`;
    } catch (err) {
      // Fallback: use timestamp
      this.packageId = `PKG-${Date.now().toString().slice(-6)}`;
    }
  }

  // Sync legacy fields
  if (this.coverImage && !this.image) this.image = this.coverImage;
  if (this.image && !this.coverImage) this.coverImage = this.image;
  if (this.galleryImages?.length > 0 && (!this.images || this.images.length === 0)) {
    this.images = this.galleryImages;
  }
  if (this.availableSeats !== undefined) this.seats = this.availableSeats;
  if (this.reviewCount !== undefined) this.reviews = this.reviewCount;

  // Sync status ↔ isActive
  if (this.status === 'Active') this.isActive = true;
  else if (this.status === 'Inactive') this.isActive = false;
  if (this.isModified('isActive')) {
    this.status = this.isActive ? 'Active' : 'Inactive';
  }

  // Auto-calc discount
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discountPercentage = Math.round((1 - this.price / this.originalPrice) * 100);
  }
});

module.exports = mongoose.model('Package', packageSchema);
