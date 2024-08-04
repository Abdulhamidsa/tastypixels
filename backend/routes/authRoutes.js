const express = require("express");
const { loginHandler, refreshAccessToken, logoutHandler } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginHandler);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutHandler);

module.exports = router;
