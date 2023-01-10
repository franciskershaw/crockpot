const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware')

const ItemCategory = require('../models/ItemCategory')

// Get all categories (for adding recipe page)
router.get('/', asyncHandler(async (req, res) => {
	try {
		const itemCategories = await ItemCategory.find()
		res.status(200).json(itemCategories)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Create a new item category
router.post('/', isLoggedIn, isAdmin, asyncHandler(async (req, res) => {
	try {
		const itemCategory = new ItemCategory(req.body);
		await itemCategory.save()

		res.status(201).json(ItemCategory)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;
