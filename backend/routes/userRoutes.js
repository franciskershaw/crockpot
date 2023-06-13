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
} = require('../controllers/userController');

// Create a user
router
  .route('/')
  .post(asyncHandler(registerUser))
  .get(isLoggedIn, asyncHandler(getUserInfo));

router.route('/login').post(asyncHandler(loginUser));

router.route('/logout').post(logoutUser);

router.route('/refreshToken').get(checkRefreshToken);

// User favourites routes
router
  .route('/favourites')
  .get(isLoggedIn, asyncHandler(getUserFavourites))
  .put(isLoggedIn, asyncHandler(editUserFavourites));

// User recipe menu routes
router
  .route('/recipeMenu')
  .get(isLoggedIn, asyncHandler(getUserRecipeMenu))
  .put(isLoggedIn, asyncHandler(editUserRecipeMenu));

// User shopping list routes
router
  .route('/shoppingList')
  .get(isLoggedIn, asyncHandler(getUserShoppingList));
// TODO - rework, this endpoint and controller to be for toggling items as obtained or not, and also to remove an item
// .put(isLoggedIn, asyncHandler(editShoppingList));

// Extra item routes
// TODO - add endpoint and logic for getting and editting extraItems
// router.route('/extraItems')
//   .get(isLoggedIn, asyncHandler(getUserExtraItems));

module.exports = router;
