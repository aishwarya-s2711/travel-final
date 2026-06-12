const express = require('express');
const router = express.Router();
const { 
  getAllCategories, 
  getCategoryByName, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controller/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/:name', getCategoryByName);

// Admin routes (need to add auth middleware in production)
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;