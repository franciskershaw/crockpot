const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const IngredientCategory = require('../models/IngredientCategory')

// Create a new ingredient
router.post('/', asyncHandler(async (req, res) => {
	try {
		const ingredientCategory = new IngredientCategory(req.body);
		await ingredientCategory.save()
		res.status(201).json(ingredientCategory)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;