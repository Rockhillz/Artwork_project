// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify token

      req.user = await User.findById(decoded.id).select('-password'); //Attach user to request

      next(); //Proceed to next middleware or controller
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorizes, token failed.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });