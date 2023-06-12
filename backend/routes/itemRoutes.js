const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const {
  getAllItems,
  createNewItem,
  editItem,
  deleteItem,
} = require('../controllers/itemController');

router.get('/', asyncHandler(getAllItems));

router.post('/', isLoggedIn, isAdmin, asyncHandler(createNewItem));

router.put('/:itemId', isLoggedIn, isAdmin, asyncHandler(editItem));

router.delete('/:itemId', isLoggedIn, isAdmin, asyncHandler(deleteItem));

module.exports = router;
