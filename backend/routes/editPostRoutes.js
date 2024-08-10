const express = require("express");
const { editPost } = require("@/controllers/editPostController");
const authenticateToken = require("@/middlewares/authenticateToken");
const router = express.Router();

/**
 * @swagger
 * /api/edit-post:
 *   put:
 *     summary: Edit an existing post or user information
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
 *                 description: The ID of the upload to edit (if updating a post)
 *               imageUrl:
 *                 type: string
 *                 description: The new image URL of the post
 *               title:
 *                 type: string
 *                 description: The new title of the post
 *               description:
 *                 type: string
 *                 description: The new description of the post
 *               category:
 *                 type: string
 *                 description: The new category of the post
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The new tags associated with the post
 *               username:
 *                 type: string
 *                 description: The new username of the user
 *               email:
 *                 type: string
 *                 description: The new email of the user
 *               password:
 *                 type: string
 *                 description: The new password for the user (will be hashed)
 *     responses:
 *       200:
 *         description: User and/or upload updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       400:
 *         description: Bad Request - No fields provided for update or invalid input data
 *       404:
 *         description: Not Found - User or upload not found
 *       500:
 *         description: Server error
 */
router.put("/edit-post", authenticateToken, editPost);

module.exports = router;
