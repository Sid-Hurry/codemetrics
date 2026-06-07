const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userModel = require('../models/userModel');

// Helper to sign JWTs
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_codemetrics_key_2026', {
    expiresIn: process.env.JWT_EXPIRY || '7d'
  });
};

class AuthController {
  /**
   * Registers a new user with email and password
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        const err = new Error('Name, email, and password fields are required.');
        err.status = 400;
        return next(err);
      }

      if (password.length < 6) {
        const err = new Error('Password must be at least 6 characters long.');
        err.status = 400;
        return next(err);
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        const err = new Error('A user with this email address already exists.');
        err.status = 400;
        return next(err);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user
      const user = await userModel.createUser({
        name,
        email,
        password: hashedPassword,
        provider: 'local'
      });

      // Issue token
      const token = signToken(user.id);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          provider: user.provider
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in user using credentials strategy
   * POST /api/auth/login
   */
  async login(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error(info && info.message ? info.message : 'Login failed.');
        error.status = 400;
        return next(error);
      }

      const token = signToken(user.id);
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          provider: user.provider
        }
      });
    })(req, res, next);
  }

  /**
   * Helper logout action
   * POST /api/auth/logout
   */
  async logout(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please remove session tokens from storage.'
    });
  }

  /**
   * Returns current authenticated user information
   * GET /api/auth/me
   */
  async me(req, res) {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  }

  /**
   * Handles OAuth callback redirection
   */
  async handleOAuthCallback(req, res) {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=OAuthFailed`);
      }
      
      const token = signToken(req.user.id);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    } catch (err) {
      console.error('Error redirecting after OAuth: ', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=OAuthRedirectError`);
    }
  }
}

module.exports = new AuthController();
