const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);

module.exports = router;
