const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      ...user,
      username: req.user.username,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
