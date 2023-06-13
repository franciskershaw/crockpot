const Joi = require('joi');

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required().messages({
    'string.empty': 'Username cannot be empty',
    'string.alphanum':
      'Username must only contain alpha-numeric characters and no spaces',
    'string.min': 'Username must be at least 3 characters long',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

const loginUserSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const createRecipeSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'string.empty': 'Recipe name is required' }),
  timeInMinutes: Joi.number()
    .required()
    .messages({ 'number.base': 'Time in minutes must be a number' }),
  ingredients: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Must be a valid ObjectId',
            'any.required': 'This field is required',
          }),
        quantity: Joi.number().required(),
        unit: Joi.string().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one ingredient is required',
    }),
  instructions: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one instruction is required',
    }),
  notes: Joi.array().items(Joi.string()),
  categories: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Must be a valid ObjectId',
        'any.required': 'This field is required',
      })
  ),
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Must be a valid ObjectId',
      'any.required': 'This field is required',
    }),
  approved: Joi.boolean(),
}).unknown(true);

const editRecipeSchema = Joi.object({
  name: Joi.string().empty(''),
  timeInMinutes: Joi.number(),
  ingredients: Joi.array().items(
    Joi.object({
      _id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          'string.pattern.base': 'Must be a valid ObjectId',
        }),
      quantity: Joi.number(),
      unit: Joi.string(),
    })
  ),
  instructions: Joi.array().items(Joi.string().empty('')),
  notes: Joi.array().items(Joi.string().empty('')),
  categories: Joi.array().items(
    Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .empty('')
      .messages({
        'string.pattern.base': 'Must be a valid ObjectId',
      })
  ),
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .empty('')
    .messages({
      'string.pattern.base': 'Must be a valid ObjectId',
    }),
  approved: Joi.boolean(),
}).unknown(true);

const recipeCategorySchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
});

const itemSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Must be a valid ObjectId',
      'any.required': 'This field is required',
    }),
});

const editItemSchema = Joi.object({
  name: Joi.string(),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Must be a valid ObjectId',
      'any.required': 'This field is required',
    }),
}).or('name', 'category');

const itemCategorySchema = Joi.object({
  name: Joi.string().required(),
  faIcon: Joi.string().required(),
});

const editItemCategorySchema = Joi.object({
  name: Joi.string(),
  faIcon: Joi.string(),
}).or('name', 'faIcon');

module.exports = {
  createUserSchema,
  loginUserSchema,
  createRecipeSchema,
  editRecipeSchema,
  recipeCategorySchema,
  itemSchema,
  editItemSchema,
  itemCategorySchema,
  editItemCategorySchema,
};
