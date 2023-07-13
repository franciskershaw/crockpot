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
  getUserExtraItems,
  toggleObtainedUserShoppingList,
  editUserExtraItems,
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
  .get(isLoggedIn, asyncHandler(getUserShoppingList))
  .put(isLoggedIn, asyncHandler(toggleObtainedUserShoppingList));

// Extra item routes
// ALSO TODO - I don't think there's anything for adding items to the shoppingList in the first place
// Note - extra items can be in the minus to account for editing the shoppingList down
router
  .route('/extraItems')
  .get(isLoggedIn, asyncHandler(getUserExtraItems))
  .put(isLoggedIn, asyncHandler(editUserExtraItems));

module.exports = router;
