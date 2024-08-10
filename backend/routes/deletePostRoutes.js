const express = require("express");
const { deletePost } = require("@/controllers/deletePostController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

/**
 * @swagger
 * /api/delete-post:
 *   delete:
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               selectedUploadId:
 *                 type: string
 *                 description: The ID of the post to delete
 *             required:
 *               - selectedUploadId
 *     responses:
 *       200:
 *         description: Upload deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
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
 *       405:
 *         description: Method Not Allowed - Request method is not DELETE
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the wrong method
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
router.delete("/delete-post", authenticateToken, deletePost);

module.exports = router;
