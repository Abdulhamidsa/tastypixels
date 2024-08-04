const express = require("express");
const { handleComments } = require("../controllers/commentController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.route("/comments").get(handleComments);

module.exports = router;
