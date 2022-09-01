const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const RecipeCategory = require('../models/RecipeCategory')

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