const express = require("express");
const { handleComments } = require("../controllers/commentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.route("/comments").get(authenticateToken, handleComments);

module.exports = router;

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Retrieve comments for a specific upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uploadId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the upload to fetch comments for
 *     responses:
 *       200:
 *         description: A list of comments for the specified upload
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The comment ID
 *                   text:
 *                     type: string
 *                     description: The text of the comment
 *                   username:
 *                     type: string
 *                     description: The username of the commenter
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the comment was created
 *       400:
 *         description: Invalid uploadId provided
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
 *       404:
 *         description: User or upload not found
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
