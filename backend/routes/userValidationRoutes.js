const express = require("express");
const { checkUsernameExists, checkEmailExists } = require("../controllers/userValidationController");
const router = express.Router();

/**
 * @swagger
 * /api/validation/check-username:
 *   post:
 *     summary: Check if a username already exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username to check
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Indicates whether the username exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: true if the username exists, false otherwise
 *       400:
 *         description: Bad Request - Username is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/check-username", checkUsernameExists);

/**
 * @swagger
 * /api/validation/check-email:
 *   post:
 *     summary: Check if an email already exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email to check
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Indicates whether the email exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: true if the email exists, false otherwise
 *       400:
 *         description: Bad Request - Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post("/check-email", checkEmailExists);

module.exports = router;
