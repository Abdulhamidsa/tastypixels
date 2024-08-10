const User = require("@/models/User");
const connectToMongoDB = require("@/database/db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const editPost = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uploadId, imageUrl, title, description, category, tags, username, email, password } = req.body;
  const userId = req.user.userId;
  if (!uploadId && !imageUrl && !title && !description && !category && !tags && !username && !email && !password) {
    return res.status(400).json({ message: "No fields provided for update" });
  }

  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    let user = await User.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ errors: ["Username already taken"] });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ errors: ["Email already in use"] });
      }
      user.email = email;
    }

    if (uploadId) {
      const uploadIndex = user.uploads.findIndex((upload) => upload._id.toString() === uploadId);
      if (uploadIndex === -1) {
        return res.status(404).json({ errors: ["Upload not found"] });
      }

      user.uploads[uploadIndex] = {
        _id: uploadId,
        imageUrl,
        title,
        description,
        category,
        tags,
      };
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({ message: "User and upload updated successfully" });
  } catch (error) {
    console.error("Error updating user in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

module.exports = { editPost };
