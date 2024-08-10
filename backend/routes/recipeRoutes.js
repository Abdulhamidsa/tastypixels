const express = require("express");
const { fetchAllPosts } = require("../controllers/recipeController");
const router = express.Router();

/**
 * @swagger
 * /recipes/all-posts?page=${number}:
 *   get:
 *     summary: Fetch all posts with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to fetch
 *     responses:
 *       200:
 *         description: A list of posts on the specified page
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID
 *                   title:
 *                     type: string
 *                     description: The title of the post
 *                   content:
 *                     type: string
 *                     description: The content of the post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date the post was created
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       400:
 *         description: Bad Request - Invalid page number
 */
router.get("/all-posts", fetchAllPosts);

module.exports = router;
