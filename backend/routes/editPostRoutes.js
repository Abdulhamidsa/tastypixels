const express = require("express");
const { editPost } = require("@/controllers/editPostController");
const authenticateToken = require("@/middlewares/authenticateToken");
const router = express.Router();

router.put("/edit-post", authenticateToken, editPost);
module.exports = router;
