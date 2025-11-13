const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();
// Health endpoints

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint (root)
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * Dedicated health check endpoint
 * 
 * GET /health -> same payload as root health
 */
router.get('/health', healthController.check.bind(healthController));

module.exports = router;
