const express = require("express");
const { updateLikesDislikes } = require("../controllers/likeDislikeController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/update-like-dislike", authenticateToken, updateLikesDislikes);

module.exports = router;
