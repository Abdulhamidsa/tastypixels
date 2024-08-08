const express = require("express");
const { addUpload } = require("../controllers/uploadController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/upload", authenticateToken, addUpload);

module.exports = router;
