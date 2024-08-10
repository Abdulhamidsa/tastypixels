const mongoose = require("mongoose");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const handleComments = async (req, res) => {
  await connectToMongoDB();
  const { uploadId } = req.query;
  console.log("Upload ID:", uploadId);
  if (!mongoose.Types.ObjectId.isValid(uploadId)) {
    console.error("Invalid uploadId:", uploadId);
    return res.status(400).json({ errors: ["Invalid uploadId"] });
  }

  try {
    const userWithUpload = await User.findOne({ "uploads._id": new mongoose.Types.ObjectId(uploadId) });
    if (!userWithUpload) {
      return res.status(404).json({ errors: ["User not found for the upload"] });
    }

    const upload = userWithUpload.uploads.id(uploadId);
    if (!upload) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }

    const comments = upload.comments.map((comment) => ({
      _id: comment._id,
      text: comment.text,
      username: comment.username,
      createdAt: comment.createdAt,
    }));

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

module.exports = { handleComments };
