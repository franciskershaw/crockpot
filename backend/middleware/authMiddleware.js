const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../models/User');

const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

// const isRightUser = asyncHandler(async (req, res, next) => {});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  try {
    if (user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error('You must be an administrator to do this');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = { isLoggedIn, isAdmin };
