import mongoose from "mongoose";
import User from "@/models/User";
import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, uploadId, text, username } = req.body; // Step 1: Accept username
  console.log("Request Body:", req.body);

  if (!userId || !uploadId || !text || !username) {
    // Adjusted to check for username
    return res.status(400).json({ errors: ["Missing required fields"] });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ errors: ["Invalid userId or uploadId"] });
  }

  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const uploadIdObj = new mongoose.Types.ObjectId(uploadId);
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
      username,
      text,
      created: new Date(),
    };

    upload.comments.push(newComment);
    await userWithUpload.save();

    console.log(newComment);

    return res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
