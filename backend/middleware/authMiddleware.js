const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * Middleware to authenticate API routes using JSON Web Tokens (JWT).
 * Extracts token from 'Authorization: Bearer <token>' header.
 */
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Authentication required. Please log in.');
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_codemetrics_key_2026');
    
    // Fetch fresh user record
    const user = await userModel.findById(decoded.id);
    if (!user) {
      const err = new Error('Your user account was not found.');
      err.status = 401;
      return next(err);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      provider: user.provider
    };
    
    next();
  } catch (error) {
    const err = new Error('Invalid or expired session. Please log in again.');
    err.status = 401;
    return next(err);
  }
};

module.exports = {
  authenticateJWT
};
