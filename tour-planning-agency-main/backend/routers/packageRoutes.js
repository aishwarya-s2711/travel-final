const express = require('express');
const router = express.Router();
const {
  getPackages, getPackageById, createPackage, updatePackage, deletePackage,
  getFeaturedPackages, getBestSellerPackages, getPackageStats,
  toggleFeatured, toggleBestSeller, searchPackages,
  getUniqueDestinations, getUniqueCategories,
} = require('../controller/packageController');
const { protect, adminOnly } = require('../utlis/authMiddleware');
const { packageImageUpload } = require('../utlis/upload');

// ── Public routes ────────────────────────────────────────────────────────────
router.get('/',             getPackages);
router.get('/featured',     getFeaturedPackages);
router.get('/bestsellers',  getBestSellerPackages);
router.get('/search',       searchPackages);
router.get('/destinations', getUniqueDestinations);
router.get('/categories',   getUniqueCategories);
router.get('/stats',        protect, adminOnly, getPackageStats);
router.get('/:id',          getPackageById);

// ── Admin routes (protected) ─────────────────────────────────────────────────
router.post('/',               protect, adminOnly, packageImageUpload, createPackage);
router.put('/:id',             protect, adminOnly, packageImageUpload, updatePackage);
router.delete('/:id',          protect, adminOnly, deletePackage);
router.patch('/:id/featured',  protect, adminOnly, toggleFeatured);
router.patch('/:id/bestseller', protect, adminOnly, toggleBestSeller);

module.exports = router;
