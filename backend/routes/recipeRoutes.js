const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Recipe = require('../models/Recipe')

// Create a new recipe 
router.post('/', asyncHandler(async (req, res) => {
	try {
		const recipe = new Recipe(req.body);
		await recipe.save()

		res.status(201).json(recipe)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

module.exports = router;