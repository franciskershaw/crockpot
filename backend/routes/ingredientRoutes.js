const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const IngredientCategory = require('../models/IngredientCategory');
const Ingredient = require('../models/Ingredient');

// Create a new ingredient
router.post('/', asyncHandler(async (req, res) => {
	try {
		const ingredient = new Ingredient(req.body)
		await ingredient.save()

		res.status(201).json(ingredient)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;
