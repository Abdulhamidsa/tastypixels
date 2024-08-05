const express = require("express");
const { deleteComment } = require("../controllers/deleteCommentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.delete("/delete-comment", authenticateToken, deleteComment);

module.exports = router;
