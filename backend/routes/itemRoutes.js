const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

const Item = require('../models/Item');

// Get all items
router.get('/', asyncHandler(async (req, res) => {
	try {
		const items = await Item.find().sort({'name': 1})
		res.status(200).json(items)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// Create a new item
router.post('/', isLoggedIn, isAdmin, asyncHandler(async (req, res) => {
	try {
		const item = new Item(req.body)
		await item.save()

		res.status(201).json(item)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))

// // TEMP - use this to seed data
// router.post('/many', asyncHandler(async (req, res) => {
// 	const newItems = req.body;

// 	for (let newItem of newItems) {
// 		try {
// 			const item = new Item()
// 			item.name = newItem.name
// 			item.category = newItem.category.id
// 			await item.save()
// 			console.log(item)
// 		} catch (err) {
// 			res.status(400)
// 			throw new Error(err)
// 		}
// 	}
// 	res.status(201).json(newItems)
// }))

module.exports = router;
