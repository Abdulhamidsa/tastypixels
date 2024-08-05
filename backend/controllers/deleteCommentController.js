const mongoose = require("mongoose");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const deleteComment = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, commentId } = req.body;

  if (!userId || !commentId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ errors: ["Invalid userId or commentId"] });
  }

  try {
    await connectToMongoDB();

    let commentDeleted = false;
    const users = await User.find();
    for (let user of users) {
      const uploadWithComment = user.uploads.find((upload) => {
        return upload.comments.some((comment) => comment._id.toString() === commentId);
      });

      if (uploadWithComment) {
        const commentIndex = uploadWithComment.comments.findIndex((comment) => comment._id.toString() === commentId);
        if (commentIndex !== -1) {
          uploadWithComment.comments.splice(commentIndex, 1);
          await user.save();
          commentDeleted = true;
          break;
        }
      }
    }

    if (!commentDeleted) {
      return res.status(404).json({ errors: ["Comment not found"] });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

module.exports = { deleteComment };
