const express = require('express');
const historyController = require('../controllers/historyController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateJWT);

router.get('/', historyController.getHistory);
router.delete('/:id', historyController.deleteHistoryItem);
router.delete('/', historyController.clearHistory);

module.exports = router;
