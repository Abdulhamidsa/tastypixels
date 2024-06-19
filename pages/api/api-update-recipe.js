import userDemo from "@/models/User";
import connectToMongoDB from "@/database/db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { uploadId, imageUrl, title, description, category, tags, userId } = req.body;

  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    let user = await userDemo.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

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

    await user.save();

    return res.status(200).json({ message: "Upload updated successfully" });
  } catch (error) {
    console.error("Error updating upload in database:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
