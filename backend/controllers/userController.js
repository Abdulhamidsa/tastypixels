const User = require("../models/User");
const connectToMongoDB = require("../database/db");
const getUserProfile = async (req, res) => {
  try {
    await connectToMongoDB();
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-userRole -deletedAt -createdAt -updatedAt -_id").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { getUserProfile };
