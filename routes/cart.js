const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// POST /api/cart - Add item to user's cart
router.post('/', async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;

    if (!user || !productId || !quantity) {
      return res.status(400).json({ error: 'user, productId and quantity are required' });
    }

    // Check if user already has a cart
    let cart = await Cart.findOne({ user });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product is already in cart
      const existingItem = cart.items.find(item => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity; // update quantity
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.updatedAt = new Date();
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// GET /api/cart/:userId - Get cart for a user
 // Correct route with userId in the URL
router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: 'userId is required in URL' });
      }
  
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found for this user' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  });
  
  router.put('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;
  
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'userId, productId, and quantity are required' });
      }
  
      // Find and update the cart for the user
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { productId, quantity } },  // You can also use $push/$addToSet for multiple items
        { new: true }
      );
  
      if (!updatedCart) {
        return res.status(404).json({ error: 'Cart not found for this user' });
      }
  
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cart', details: error.message });
    }
  });
  
  router.delete('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: 'userId is required in URL' });
      }
  
      const deletedCart = await Cart.findOneAndDelete({ user: userId });
  
      if (!deletedCart) {
        return res.status(404).json({ error: 'Cart not found for this user' });
      }
  
      res.status(200).json({ message: 'Cart deleted successfully', cart: deletedCart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete cart', details: error.message });
    }
  });
  

module.exports = router;
