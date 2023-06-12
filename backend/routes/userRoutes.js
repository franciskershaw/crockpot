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
  getUserShoppingList,
  getUserFavourites,
  editUser,
  editShoppingList,
} = require('../controllers/userController');

router.post('/', asyncHandler(registerUser));

router.post('/login', asyncHandler(loginUser));

router.get('/refreshToken', checkRefreshToken);

router.post('/logout', logoutUser);

router.get('/', isLoggedIn, asyncHandler(getUserInfo));

router.get('/recipeMenu', isLoggedIn, asyncHandler(getUserRecipeMenu));

router.get('/shoppingList', isLoggedIn, asyncHandler(getUserShoppingList));

router.get('/favourites', isLoggedIn, asyncHandler(getUserFavourites));

router.put('/', isLoggedIn, asyncHandler(editUser));

router.put('/shoppingList', isLoggedIn, asyncHandler(editShoppingList));

module.exports = router;
