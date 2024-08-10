const express = require("express");
const { addUpload } = require("../controllers/uploadController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Add a new upload to the user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: The URL of the image to upload
 *               title:
 *                 type: string
 *                 description: The title of the upload
 *               description:
 *                 type: string
 *                 description: A brief description of the upload
 *               category:
 *                 type: string
 *                 description: The category of the upload
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the upload
 *             required:
 *               - imageUrl
 *               - title
 *     responses:
 *       200:
 *         description: Upload saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad Request - Upload limit reached or missing/invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: An array of error messages
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: An array of error messages
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: An array of error messages
 */
router.post("/upload", authenticateToken, addUpload);

module.exports = router;
