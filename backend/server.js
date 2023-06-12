const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');

// Grab port info from config
const PORT = process.env.PORT || 5000;

// Connect to Mongo database
connectDB();

// Initialize app
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser
app.use(cookieParser())

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/itemCategories', require('./routes/itemCategoryRoutes'));
app.use('/api/recipeCategories', require('./routes/recipeCategoryRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));

// Error handler
app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the crockpot API' });
});

// Listen for app
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.underline)
);
