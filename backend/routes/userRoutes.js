const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { isLoggedIn } = require('../middleware/authMiddleware');

const {
  registerUser,
  loginUser,
  logoutUser,
  checkRefreshToken,
  getUserInfo,
  getUserRecipeMenu,
  editUserRecipeMenu,
  getUserShoppingList,
  getUserFavourites,
  editUserFavourites,
  editShoppingList,
} = require('../controllers/userController');

// Create a user
router.post('/', asyncHandler(registerUser));

// Get user info
router.get('/', isLoggedIn, asyncHandler(getUserInfo));

// Flagged for deletion
// router.put('/', isLoggedIn, asyncHandler(editUser));

router.post('/login', asyncHandler(loginUser));
router.post('/logout', logoutUser);
router.get('/refreshToken', checkRefreshToken);

// Get favourites from user object
router.get('/favourites', isLoggedIn, asyncHandler(getUserFavourites));
router.put('/favourites', isLoggedIn, asyncHandler(editUserFavourites));

// Get a user's recipe menu from their user object
router.get('/recipeMenu', isLoggedIn, asyncHandler(getUserRecipeMenu));
// TODO - edit user's recipe menu by either adding one in, removing one, or amending the serves quantity of a recipe
router.put('/recipeMenu', isLoggedIn, asyncHandler(editUserRecipeMenu));

// Get a user's shoppingList array from user object (populated with proper information)
router.get('/shoppingList', isLoggedIn, asyncHandler(getUserShoppingList));
// TODO - rework, this endpoint and controller to be for toggling items as obtained or not, and also to remove an item
router.put('/shoppingList', isLoggedIn, asyncHandler(editShoppingList));

module.exports = router;
