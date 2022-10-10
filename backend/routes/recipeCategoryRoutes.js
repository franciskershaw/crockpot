const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const RecipeCategory = require('../models/RecipeCategory')

// Get all recipe categories
router.get('/', asyncHandler(async (req, res) => {
	try {
		const recipeCategories = await RecipeCategory.find()
		res.status(200).json(recipeCategories);
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Create a new recipe category
router.post('/', asyncHandler(async (req, res) => {
	try {
		const recipeCategory = new RecipeCategory(req.body);
		await recipeCategory.save()

		res.status(201).json(recipeCategory)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;