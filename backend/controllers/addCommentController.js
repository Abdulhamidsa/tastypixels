const mongoose = require("mongoose");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const addComment = async (req, res) => {
  const { uploadId, text } = req.body;
  const userId = req.user.userId;
  if (!uploadId || !text) {
    return res.status(400).json({ errors: ["Missing required fields"] });
  }
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ errors: ["Invalid userId or uploadId"] });
  }
  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const uploadIdObj = new mongoose.Types.ObjectId(uploadId);
    const user = await User.findById(userIdObj).lean();
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }
    const username = user.username;
    const friendlyId = user.friendlyId;
    const userWithUpload = await User.findOne({ "uploads._id": uploadIdObj });
    if (!userWithUpload) {
      return res.status(404).json({ errors: ["User not found for the upload"] });
    }
    const upload = userWithUpload.uploads.id(uploadIdObj);
    if (!upload) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }
    const newComment = {
      userId: userIdObj,
      friendlyId,
      username,
      text,
      createdAt: new Date(),
    };
    upload.comments.push(newComment);
    await userWithUpload.save();
    const { userId: _, ...responseComment } = newComment;
    console.log(responseComment);
    return res.status(200).json({
      message: "Comment added successfully",
      comment: responseComment,
    });
  } catch (error) {
    console.error("Error adding comment in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};
module.exports = { addComment };
