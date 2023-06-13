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

router
  .route('/')
  .get(asyncHandler(getAllRecipes))
  .post(
    isLoggedIn,
    isAdmin,
    upload.single('image'),
    asyncHandler(createNewRecipe)
  );

router
  .route('/:recipeId')
  .get(asyncHandler(getSingleRecipe))
  .put(isLoggedIn, isAdmin, upload.single('image'), asyncHandler(editRecipe))
  .delete(isLoggedIn, isAdmin, asyncHandler(deleteRecipe));

module.exports = router;
