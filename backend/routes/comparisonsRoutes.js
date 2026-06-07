const express = require('express');
const comparisonsController = require('../controllers/comparisonsController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateJWT);

router.post('/', comparisonsController.saveComparison);
router.get('/', comparisonsController.getComparisons);
router.delete('/:id', comparisonsController.deleteComparison);

module.exports = router;
