const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const connectDB = require('./config/db');
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');

// Grab port info from config
const PORT = process.env.PORT || 5000;

// Connect to Mongo database
connectDB();

// Initialize app
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/itemCategories', require('./routes/itemCategoryRoutes'));
app.use('/api/recipeCategories', require('./routes/recipeCategoryRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));


// Error handler
app.use(errorHandler);

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html')
  );
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the crockpot API' });
  });
}

// Listen for app
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
