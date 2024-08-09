const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date when the user was created
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
