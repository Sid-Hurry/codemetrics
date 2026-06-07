const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Local Registration & Sessions
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticateJWT, authController.me);

// 2. Google OAuth Handlers
router.get(
  '/google',
  (req, res, next) => {
    const client = process.env.GOOGLE_CLIENT_ID;
    const secret = process.env.GOOGLE_CLIENT_SECRET;
    if (!client || !secret || secret === 'placeholder_secret_replace_me') {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GoogleNotConfigured`);
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    const client = process.env.GOOGLE_CLIENT_ID;
    const secret = process.env.GOOGLE_CLIENT_SECRET;
    if (!client || !secret || secret === 'placeholder_secret_replace_me') {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GoogleNotConfigured`);
    }
    next();
  },
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GoogleOAuthFailed`, session: false }),
  authController.handleOAuthCallback
);

// 3. GitHub OAuth Handlers
router.get(
  '/github',
  (req, res, next) => {
    const client = process.env.GITHUB_CLIENT_ID;
    const secret = process.env.GITHUB_CLIENT_SECRET;
    if (!client || !secret || secret === 'placeholder_secret_replace_me') {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GitHubNotConfigured`);
    }
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  (req, res, next) => {
    const client = process.env.GITHUB_CLIENT_ID;
    const secret = process.env.GITHUB_CLIENT_SECRET;
    if (!client || !secret || secret === 'placeholder_secret_replace_me') {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GitHubNotConfigured`);
    }
    next();
  },
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GitHubOAuthFailed`, session: false }),
  authController.handleOAuthCallback
);

module.exports = router;
