const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
 app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI =  'mongodb+srv://parwatiad25:product@product-catalog.q2ja5mm.mongodb.net/?retryWrites=true&w=majority&appName=product-catalog';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB Atlas connection error:', err));

// Routes
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart'); // Add this line to import cart routes

app.use('/api/items', itemRoutes);
app.use('/api/cart', cartRoutes); // Add this line to use cart routes


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
