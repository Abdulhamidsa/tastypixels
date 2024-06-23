import mongoose from "mongoose";
import User from "@/models/User";
import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, uploadId, text } = req.body;
  console.log("Request Body:", req.body);

  if (!userId || !uploadId || !text) {
    return res.status(400).json({ errors: ["Missing required fields"] });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ errors: ["Invalid userId or uploadId"] });
  }

  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const uploadIdObj = new mongoose.Types.ObjectId(uploadId);

    const user = await User.findById(userIdObj);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

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
      username: user.username,
      avatar: user.avatar,
      text,
      createdAt: new Date(),
    };

    upload.comments.push(newComment);
    user.comments.push({ uploadId: uploadIdObj, text });

    await userWithUpload.save();
    await user.save();

    return res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
