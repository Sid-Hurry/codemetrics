const express = require('express');
const profileController = require('../controllers/profileController');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * /api/analyze/{username}:
 *   post:
 *     summary: Fetch and analyze GitHub profile, then store in local MySQL DB
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub login username
 *     responses:
 *       201:
 *         description: Profile analyzed and stored successfully
 *       400:
 *         description: Invalid username format or input error
 *       404:
 *         description: GitHub user does not exist
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Database error or external server crash
 */
router.post('/analyze/:username', apiLimiter, profileController.analyzeProfile);

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Get all stored profiles from local DB with pagination and filter options
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Column name to sort by (e.g. developer_score, total_stars)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting direction
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching username, name or location
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.get('/profiles', profileController.getAllProfiles);

/**
 * @swagger
 * /api/profiles/{username}:
 *   get:
 *     summary: Retrieve a single analyzed profile from local DB
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Analyzed GitHub login username
 *     responses:
 *       200:
 *         description: Profile details returned successfully
 *       404:
 *         description: Profile hasn't been analyzed or saved in DB
 *       500:
 *         description: Internal Server Error
 */
router.get('/profiles/:username', profileController.getProfileByUsername);

/**
 * @swagger
 * /api/profiles/{username}:
 *   delete:
 *     summary: Delete an analyzed profile record from local DB
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub login username to delete
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found in database records
 *       500:
 *         description: Internal Server Error
 */
router.delete('/profiles/:username', profileController.deleteProfile);

module.exports = router;
