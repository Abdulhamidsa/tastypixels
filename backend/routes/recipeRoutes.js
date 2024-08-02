const express = require("express");
const { fetchAllPosts } = require("../controllers/recipeController");
const router = express.Router();

router.get("/all-posts", fetchAllPosts);

module.exports = router;
