const express = require('express');
const aiController = require('../controllers/aiController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateJWT);

router.post('/compare', aiController.compareDevelopers);
router.post('/regenerate/:username', aiController.regenerateInsights);

// Career Intelligence routes
router.post('/career/:username', aiController.getCareerInsights);
router.post('/career/regenerate/:username', aiController.regenerateCareerInsights);

module.exports = router;

