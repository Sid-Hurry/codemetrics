const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateJWT, dashboardController.getDashboardData);

module.exports = router;
