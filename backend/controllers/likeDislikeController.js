const mongoose = require("mongoose");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const updateLikesDislikes = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uploadId, action } = req.body;

  try {
    await connectToMongoDB();
    const userId = req.user.userId; // Extract user ID from the token
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const uploadIdObj = new mongoose.Types.ObjectId(uploadId);

    let user = await User.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    const likedIndex = user.likedPosts.findIndex((post) => post.uploadId.toString() === uploadId);
    const dislikedIndex = user.dislikedPosts.findIndex((post) => post.uploadId.toString() === uploadId);

    switch (action) {
      case "like":
        if (likedIndex !== -1) {
          user.likedPosts.splice(likedIndex, 1);
        } else {
          if (dislikedIndex !== -1) {
            user.dislikedPosts.splice(dislikedIndex, 1);
          }
          user.likedPosts.push({ uploadId: uploadIdObj });
        }
        break;
      case "dislike":
        if (dislikedIndex !== -1) {
          user.dislikedPosts.splice(dislikedIndex, 1);
        } else {
          if (likedIndex !== -1) {
            user.likedPosts.splice(likedIndex, 1);
          }
          user.dislikedPosts.push({ uploadId: uploadIdObj });
        }
        break;
      default:
        return res.status(400).json({ errors: ["Invalid action"] });
    }

    await user.save();

    const userWithUpload = await User.findOne({ "uploads._id": uploadIdObj });

    if (!userWithUpload) {
      return res.status(404).json({ errors: ["User not found for the upload"] });
    }

    const upload = userWithUpload.uploads.id(uploadIdObj);

    if (!upload) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }

    if (action === "like") {
      if (likedIndex !== -1) {
        upload.likes -= 1;
      } else {
        upload.likes += 1;
        if (dislikedIndex !== -1 && upload.dislikes > 0) {
          upload.dislikes -= 1;
        }
      }
    } else if (action === "dislike") {
      if (dislikedIndex !== -1) {
        upload.dislikes -= 1;
      } else {
        upload.dislikes += 1;
        if (likedIndex !== -1 && upload.likes > 0) {
          upload.likes -= 1;
        }
      }
    }

    await userWithUpload.save();

    return res.status(200).json({
      message: `Action '${action}' updated successfully`,
      upload: {
        _id: uploadId,
        likes: upload.likes,
        dislikes: upload.dislikes,
      },
    });
  } catch (error) {
    console.error("Error updating likes/dislikes in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};
module.exports = { updateLikesDislikes };
