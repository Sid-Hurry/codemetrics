const express = require('express');
const favoritesController = require('../controllers/favoritesController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateJWT);

router.post('/', favoritesController.addFavorite);
router.get('/', favoritesController.getFavorites);
router.delete('/:id', favoritesController.removeFavorite);

module.exports = router;
