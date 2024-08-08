const express = require("express");
const { loginHandler, refreshAccessToken, logoutHandler } = require("../controllers/loginController");
const { signupHandler } = require("@/controllers/signupController");
const router = express.Router();

router.post("/login", loginHandler);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutHandler);
router.post("/signup", signupHandler);

module.exports = router;
