const mongoose = require("mongoose");
const User = require("@/models/User");
const connectToMongoDB = require("@/database/db");
const deletePost = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  } else {
    const { selectedUploadId } = req.body;
    const userId = req.user.userId;
    try {
      await connectToMongoDB();
      const userIdObj = new mongoose.Types.ObjectId(userId);
      let user = await User.findById(userIdObj);
      if (!user) {
        return res.status(404).json({ errors: ["User not found"] });
      }
      user.uploads = user.uploads.filter((upload) => upload._id.toString() !== selectedUploadId);
      await user.save();
      return res.status(200).json({ message: "Upload deleted successfully" });
    } catch (error) {
      console.error("Error deleting upload:", error);
      return res.status(500).json({ errors: ["Server error"] });
    }
  }
};
module.exports = { deletePost };
