const express = require("express");
const { addComment } = require("../controllers/addCommentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * /api/add-comment:
 *   post:
 *     summary: Add a comment to an existing upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uploadId:
 *                 type: string
 *                 description: The ID of the upload to add a comment to
 *               text:
 *                 type: string
 *                 description: The text of the comment
 *             required:
 *               - uploadId
 *               - text
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 comment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The comment ID
 *                     username:
 *                       type: string
 *                       description: The username of the commenter
 *                     text:
 *                       type: string
 *                       description: The text of the comment
 *                     created:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the comment was created
 *       400:
 *         description: Bad Request - Missing required fields or invalid IDs
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
 *         description: Not Found - User or upload not found
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
router.post("/add-comment", authenticateToken, addComment);

module.exports = router;
