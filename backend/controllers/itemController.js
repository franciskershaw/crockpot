const { itemSchema, editItemSchema } = require('../joiSchemas/schemas');
const Item = require('../models/Item');

const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const createNewItem = async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const item = new Item(value);
    await item.save();

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const editItem = async (req, res, next) => {
  try {
    const { error, value } = editItemSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const item = await Item.findByIdAndUpdate(req.params.itemId, value, {
      new: true,
    });

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    await item.remove();
    res.status(200).json({ msg: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllItems, createNewItem, editItem, deleteItem };
