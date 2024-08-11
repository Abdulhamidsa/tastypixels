const express = require("express");
const { loginHandler, refreshAccessToken, logoutHandler } = require("@/controllers/loginController");
const { signupHandler } = require("@/controllers/signupController");
const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginHandler);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to generate a new access token
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The new JWT access token
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/refresh-token", refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout success message
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logoutHandler);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The desired username for the new user
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The desired password for the new user
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the newly created user
 *                 message:
 *                   type: string
 *                   description: A success message
 *       400:
 *         description: Bad request - Missing required fields or invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signupHandler);

module.exports = router;
