const express = require("express");
const { updateLikesDislikes } = require("../controllers/likeDislikeController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * @swagger
 * /api/update-like-dislike:
 *   post:
 *     summary: Update likes or dislikes on a post
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
 *                 description: The ID of the upload to update
 *               action:
 *                 type: string
 *                 enum: [like, dislike]
 *                 description: The action to perform, either "like" or "dislike"
 *             required:
 *               - uploadId
 *               - action
 *     responses:
 *       200:
 *         description: Action updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 upload:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the upload
 *                     likes:
 *                       type: integer
 *                       description: The total number of likes for the upload
 *                     dislikes:
 *                       type: integer
 *                       description: The total number of dislikes for the upload
 *       400:
 *         description: Bad Request - Invalid action or missing fields
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
 *         description: Method Not Allowed - Request method is not POST
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
router.post("/update-like-dislike", authenticateToken, updateLikesDislikes);

module.exports = router;
