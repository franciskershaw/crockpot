const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const {
  getAllItemCategories,
  createNewItemCategory,
  editItemCategory,
} = require('../controllers/itemCategoryController');

router.get('/', asyncHandler(getAllItemCategories));

router.post('/', isLoggedIn, isAdmin, asyncHandler(createNewItemCategory));

router.put(
  '/:itemCategoryId',
  isLoggedIn,
  isAdmin,
  asyncHandler(editItemCategory)
);

module.exports = router;
