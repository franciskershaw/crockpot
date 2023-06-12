const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const {
  getAllRecipes,
  createNewRecipe,
  getSingleRecipe,
  editRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

router.get('/', asyncHandler(getAllRecipes));

router.post(
  '/',
  isLoggedIn,
  isAdmin,
  upload.single('image'),
  asyncHandler(createNewRecipe)
);

router.get('/:recipeId', asyncHandler(getSingleRecipe));

router.put(
  '/:recipeId',
  isLoggedIn,
  isAdmin,
  upload.single('image'),
  asyncHandler(editRecipe)
);

router.delete('/:recipeId', isLoggedIn, isAdmin, asyncHandler(deleteRecipe));

module.exports = router;
