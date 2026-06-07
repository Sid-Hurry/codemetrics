const express = require('express');
const profileController = require('../controllers/profileController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication for all profile analysis and lookup routes
router.use(authenticateJWT);

router.post('/analyze/:username', apiLimiter, profileController.analyzeProfile);
router.get('/profiles', profileController.getAllProfiles);
router.get('/profiles/:username', profileController.getProfileByUsername);
router.delete('/profiles/:username', profileController.deleteProfile);

module.exports = router;
