const express = require('express');
const router = express.Router();
const publicController = require('../controller/publicController');

router.get('/destinations', publicController.getDestinations);
router.get('/destinations/:id', publicController.getDestinationById);
router.get('/blogs', publicController.getBlogs);
router.get('/blogs/:id', publicController.getBlogById);
router.get('/team', publicController.getTeam);
router.get('/faqs', publicController.getFAQs);
router.get('/stats', publicController.getStats);
router.post('/contact', publicController.submitContact);

module.exports = router;
