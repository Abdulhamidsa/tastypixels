const express = require("express");
const { deletePost } = require("@/controllers/deletePostController");
const authenticateToken = require("../middlewares/authenticateToken");
const router = express.Router();

router.delete("/delete-post", authenticateToken, deletePost);
module.exports = router;
