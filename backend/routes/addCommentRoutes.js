const express = require("express");
const { addComment } = require("../controllers/addCommentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.route("/add-comment", authenticateToken, addComment);

module.exports = router;
