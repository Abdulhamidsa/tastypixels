const express = require("express");
const { deleteComment } = require("../controllers/deleteCommentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * /api/delete-comment:
 *   delete:
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: The ID of the comment to delete
 *             required:
 *               - commentId
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad Request - Invalid userId or commentId
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
 *         description: Comment not found or user not authorized
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
router.delete("/delete-comment", authenticateToken, deleteComment);

module.exports = router;
