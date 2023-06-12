const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const {
  getAllRecipeCategories,
  createNewRecipeCategory,
  editRecipeCategory,
  deleteRecipeCategory,
} = require('../controllers/recipeCategoryController');

router.get('/', asyncHandler(getAllRecipeCategories));

router.post('/', isLoggedIn, isAdmin, asyncHandler(createNewRecipeCategory));

router.put(
  '/:recipeCategoryId',
  isLoggedIn,
  isAdmin,
  asyncHandler(editRecipeCategory)
);

// Delete recipe category
router.delete(
  '/:recipeCategoryId',
  isLoggedIn,
  isAdmin,
  asyncHandler(deleteRecipeCategory)
);

module.exports = router;
