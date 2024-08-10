const mongoose = require("mongoose");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const deleteComment = async (req, res) => {
  const { userId } = req.user;
  const { commentId } = req.body;

  if (!userId || !commentId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ errors: ["Invalid userId or commentId"] });
  }

  try {
    await connectToMongoDB();

    let commentDeleted = false;
    const users = await User.find();

    for (let user of users) {
      for (let upload of user.uploads) {
        const commentIndex = upload.comments.findIndex((comment) => comment._id.toString() === commentId);

        if (commentIndex !== -1 && upload.comments[commentIndex].userId.toString() === userId) {
          upload.comments.splice(commentIndex, 1);
          await user.save();
          commentDeleted = true;
          break;
        }
      }

      if (commentDeleted) {
        break;
      }
    }

    if (!commentDeleted) {
      return res.status(404).json({ errors: ["Comment not found or not authorized"] });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

module.exports = { deleteComment };
