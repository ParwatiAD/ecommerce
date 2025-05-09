const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// POST /api/reviews - Create a new review
router.post('/', async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;

    if (!user || !product || !rating) {
      return res.status(400).json({ error: 'user, product, and rating are required' });
    }

    const newReview = new Review({ user, product, rating, comment });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// GET /api/reviews/:productId - Get all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate('user', 'name');

    if (!reviews.length) {
      return res.status(404).json({ error: 'No reviews found for this product' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});
router.put('/:id', async (req, res) => {
    try {
      const { rating, comment } = req.body;
  
      // Validate required fields
      if (rating == null) {
        return res.status(400).json({ error: 'Rating is required' });
      }
  
      // Update the review
      const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        { rating, comment },
        { new: true, runValidators: true }
      );
  
      if (!updatedReview) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
});

module.exports = router;
