const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

// Register new user
router.post('/', asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	// Validation
	if (!username || !password) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Check user doesn't already exist
	const userExists = await User.findOne({ username })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

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
	})

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
			token: generateToken(user._id)
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
}))

// Login a user
router.post('/login', asyncHandler(async (req, res) => {
	try {
			const { username, password } = req.body;

			const user = await User.findOne({ username })
			
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
					})
			} else {
					res.status(401).json({message: 'Invalid credentials'})
					// throw new Error('Invalid credentials')
			}
	} catch (err) {
			console.log(err)
			throw new Error(err)
	}
}))

// Temp - get user by id
router.get('/:userId', asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		res.status(200).json(user)
	} catch (err) {
		throw new Error('Cannee find user')
	}
}))

// Edit user
router.put('/:userId', asyncHandler(async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.userId,
			req.body,
			{ new: true }
		);
		res.status(200).json(updatedUser)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Generate token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})
}

module.exports = router;