const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Item = require('../models/Item');

const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require('../errors/errors');

const {
  generateShoppingList,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateUserObject,
} = require('../helper/helper');

const { createUserSchema, loginUserSchema } = require('../joiSchemas/schemas');

const registerUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { username, password } = value;

    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new ConflictError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    if (user) {
      const refreshToken = generateRefreshToken(user._id);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json(generateUserObject(user));
    } else {
      throw new InternalServerError('Error creating user');
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginUserSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { username, password } = value;

    const user = await User.findOne({ username });

    if (!user) {
      throw new BadRequestError('Username or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestError('Username or password is incorrect');
    }

    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json(generateUserObject(user));
  } catch (err) {
    next(err);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'User logged out' });
};

const checkRefreshToken = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    throw new UnauthorizedError('No refresh token', 'NO_TOKEN');

  const refreshToken = cookies.refreshToken;

  try {
    const { _id } = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = generateAccessToken(_id);

    res.json({ accessToken, _id });
  } catch (error) {
    res.clearCookie('refreshToken');

    throw new UnauthorizedError('Issues validating the token');
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(generateUserObject(user));
  } catch (err) {
    next(err);
  }
};

const getUserRecipeMenu = async (req, res, next) => {
  try {
    const { recipeMenu } = await User.findById(req.user._id);
    const recipes = await Recipe.find({ _id: { $in: recipeMenu } });
    const menu = [];

    for (const recipe of recipes) {
      const { serves } = recipeMenu.find((item) => item._id.equals(recipe._id));
      menu.push({ recipe, serves });
    }

    res.status(200).json(menu);
  } catch (err) {
    next(err);
  }
};

const getUserShoppingList = async (req, res, next) => {
  try {
    const { shoppingList, extraItems } = await User.findById(req.user._id);
    const shoppingListItems = await Item.find({ _id: { $in: shoppingList } });

    let list = [];

    for (const item of shoppingListItems) {
      const { quantity, unit, obtained } = shoppingList.find(
        (shoppingListItem) => item._id.equals(shoppingListItem._id)
      );
      list.push({ item, quantity, unit, obtained });
    }

    for (const item of extraItems) {
      const existing = list.find(
        (obj) => obj.item._id.equals(item._id) && obj.unit === item.unit
      );
      if (existing) {
        list = list.map((obj) => {
          if (obj.item._id.equals(item._id) && obj.unit === item.unit) {
            return { ...obj, quantity: obj.quantity + item.quantity };
          }
          return obj;
        });
      } else {
        const { quantity, unit, obtained } = item;
        const additional = await Item.findById(item._id);
        list.push({ item: additional, quantity, unit, obtained });
      }
    }

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

const getUserFavourites = async (req, res, next) => {
  try {
    const { favouriteRecipes } = await User.findById(req.user._id);
    const favourites = await Recipe.find({ _id: { $in: favouriteRecipes } })
      .populate('createdBy', 'username') // 'username' is the field you want to include from User model
      .populate('categories');

    res.status(200).json(favourites);
  } catch (err) {
    next(err);
  }
};

// const editUser = async (req, res, next) => {
//   try {
//     let userToUpdate = await User.findById(req.user._id);
//     let shoppingList;
//     let extraItems;

//     if (req.body.recipeMenu) {
//       shoppingList = await generateShoppingList(req.body.recipeMenu);
//     } else {
//       shoppingList = userToUpdate.shoppingList;
//     }

//     if (req.body.extraItems) {
//       if (req.body.extraItems.length) {
//         extraItems = userToUpdate.extraItems;
//         extraItems.push(req.body.extraItems[0]);
//       } else if (!req.body.extraItems.length) {
//         // Pass in an empty array from the frontend if the user is to clear extraItems
//         extraItems = [];
//       }
//     } else {
//       extraItems = userToUpdate.extraItems;
//     }

//     let updates = { ...req.body, shoppingList, extraItems };
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       updates,
//       { new: true }
//     );
//     if (req.body.recipeMenu) {
//       const newShoppingList = await generateShoppingList(
//         updatedUser.recipeMenu
//       );
//       updatedUser.shoppingList = newShoppingList;
//       updatedUser.save();
//     }
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     next(err);
//   }
// };

const editShoppingList = async (req, res, next) => {
  try {
    let userToUpdate = await User.findById(req.user._id);
    let shoppingList = userToUpdate.shoppingList;
    let extraItems = userToUpdate.extraItems;

    for (let item of shoppingList) {
      if (item._id.equals(req.body.recipeId)) {
        item.obtained = !item.obtained;
      }
    }

    for (let item of extraItems) {
      if (item._id.equals(req.body.recipeId)) {
        item.obtained = !item.obtained;
      }
    }

    userToUpdate.shoppingList = shoppingList;
    userToUpdate.extraItems = extraItems;
    userToUpdate.save();
    res.status(200).json(shoppingList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  checkRefreshToken,
  logoutUser,
  getUserInfo,
  getUserRecipeMenu,
  getUserShoppingList,
  getUserFavourites,
  editShoppingList,
};
