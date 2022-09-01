const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const ItemCategory = require('../models/ItemCategory')

// Create a new item category
router.post('/', asyncHandler(async (req, res) => {
	try {
		const itemCategory = new ItemCategory(req.body);
		await itemCategory.save()

		res.status(201).json(ItemCategory)
	} catch (err) {
		res.status(400)
		throw new Error(err)
	}
}))


// TEMP - use this to seed data
// router.post('/many', asyncHandler(async (req, res) => {
// 	const newItems = req.body;

// 	for (let newItem of newItems) {
// 		try {
// 			const item = new ItemCategory()
// 			item.name = newItem.name
// 			item.faIcon = newItem.faIcon
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
