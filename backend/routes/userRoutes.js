const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Item = require('../models/Item');
const { isLoggedIn, isRightUser } = require('../middleware/authMiddleware');

// Register new user
router.post(
	'/',
	asyncHandler(async (req, res) => {
		const { username, password } = req.body;

		// Validation
		if (!username || !password) {
			res.status(400);
			throw new Error('Please include all fields');
		}

		// Check user doesn't already exist
		const userExists = await User.findOne({ username });

		if (userExists) {
			res.status(400);
			throw new Error('User already exists');
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = await User.create({
			username,
			password: hashedPassword,
			isAdmin: false,
			favouriteRecipes: [],
			recipeMenu: [],
			shoppingList: [],
			regularItems: [],
			extraItems: [],
		});

		if (user) {
			res.status(201).json({
				_id: user._id,
				username: user.username,
				isAdmin: user.isAdmin,
				favouriteRecipes: user.favouriteRecipes,
				recipeMenu: user.recipeMenu,
				shoppingList: user.ShoppingList,
				regularItems: user.regularItems,
				extraItems: user.extraItems,
				token: generateToken(user._id),
			});
		} else {
			res.status(400);
			throw new Error('Invalid user data');
		}
	})
);

// Login a user
router.post(
	'/login',
	asyncHandler(async (req, res) => {
		try {
			const { username, password } = req.body;

			const user = await User.findOne({ username });

			// Check credentials match
			if (user && (await bcrypt.compare(password, user.password))) {
				res.status(200).json({
					_id: user._id,
					username: user.username,
					isAdmin: user.isAdmin,
					favouriteRecipes: user.favouriteRecipes,
					recipeMenu: user.recipeMenu,
					shoppingList: user.shoppingList,
					regularItems: user.regularItems,
					extraItems: user.extraItems,
					token: generateToken(user._id),
				});
			} else {
				res.status(401).json({ message: 'Invalid credentials' });
				// throw new Error('Invalid credentials')
			}
		} catch (err) {
			console.log(err);
			throw new Error(err);
		}
	})
);

// Get username by ID
router.get(
	'/:userId',
	isLoggedIn,
	asyncHandler(async (req, res) => {
		try {
			const user = await User.findById(req.params.userId);
			res.status(200).json({
				username: user.username,
			});
		} catch (err) {
			throw new Error("Can't find user");
		}
	})
);

// Get recipe menu from user
router.get(
	'/:userId/recipeMenu',
	isLoggedIn,
	isRightUser,
	asyncHandler(async (req, res) => {
		try {
			const { recipeMenu } = await User.findById(req.params.userId);
			const recipes = await Recipe.find({ _id: { $in: recipeMenu } });
			const menu = [];

			for (const recipe of recipes) {
				const { serves } = recipeMenu.find((item) =>
					item._id.equals(recipe._id)
				);
				menu.push({ recipe, serves });
			}

			res.status(200).json(menu);
		} catch (err) {
			res.status(400);
			throw new Error(err);
		}
	})
);

// Get shopping list from user
router.get(
	'/:userId/shoppingList',
	isLoggedIn,
	isRightUser,
	asyncHandler(async (req, res) => {
		try {
			const { shoppingList } = await User.findById(req.params.userId);
			const shoppingListItems = await Item.find({ _id: { $in: shoppingList } });
			const list = [];

			for (const item of shoppingListItems) {
				const { quantity, unit, obtained } = shoppingList.find((shoppingListItem) =>
					item._id.equals(shoppingListItem._id)
				);
				list.push({ item, quantity, unit, obtained });
			}
			res.status(200).json(list);
		} catch (err) {
			res.status(400);
			throw new Error(err);
		}
	})
);

// Get favourites from user
router.get(
	'/:userId/favourites',
	isLoggedIn,
	isRightUser,
	asyncHandler(async (req, res) => {
		try {
			const { favouriteRecipes } = await User.findById(req.params.userId);
			const favourites = await Recipe.find({ _id: { $in: favouriteRecipes } });

			res.status(200).json(favourites);
		} catch (err) {
			res.status(400);
			throw new Error(err);
		}
	})
);

// Edit user
router.put(
	'/:userId',
	isLoggedIn,
	isRightUser,
	asyncHandler(async (req, res) => {
		try {
			let userToUpdate = await User.findById(req.params.userId);
			let shoppingList;

			if (req.body.recipeMenu) {
				shoppingList = await generateShoppingList(req.body.recipeMenu);
			} else {
				shoppingList = userToUpdate.shoppingList;
			}

			let updates = { ...req.body, shoppingList };
			const updatedUser = await User.findByIdAndUpdate(
				req.params.userId,
				updates,
				{ new: true }
			);
			if (req.body.recipeMenu) {
				const newShoppingList = await generateShoppingList(
					updatedUser.recipeMenu
				);
				updatedUser.shoppingList = newShoppingList;
				updatedUser.save();
			}
			res.status(200).json(updatedUser);
		} catch (err) {
			res.status(400);
			throw new Error(err);
		}
	})
);

const generateShoppingList = async (menu) => {
	let shoppingList = [];
	if (menu.length) {
		for (let object of menu) {
			const recipe = await Recipe.findById(object._id).select({
				ingredients: 1,
			});
			const ingredients = recipe.toObject().ingredients;
			let ingredientsFormated = ingredients.map((ingredient) => {
				return {
					...ingredient,
					quantity: ingredient.quantity * object.serves,
					obtained: false,
				};
			});
			shoppingList = [
				...shoppingList.filter(
					(obj) =>
						!ingredientsFormated.some(
							(newObj) => newObj._id.equals(obj._id) && newObj.unit === obj.unit
						)
				),
				...ingredientsFormated.map((obj) => {
					const originalObj = shoppingList.find(
						(originalObj) =>
							originalObj._id.equals(obj._id) && originalObj.unit === obj.unit
					);
					if (originalObj) {
						return {
							...obj,
							quantity: originalObj.quantity + obj.quantity,
						};
					}
					return obj;
				}),
			];
		}
	}
	return shoppingList;
};

// Generate token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

module.exports = router;
