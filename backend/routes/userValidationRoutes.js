const express = require("express");
const { checkUsernameExists, checkEmailExists } = require("../controllers/userValidationController");
const router = express.Router();

router.post("/check-username", checkUsernameExists);

router.post("/check-email", checkEmailExists);

module.exports = router;
