import connectToMongoDB from "@/database/db";
import User from "@/models/User"; // Adjust path as needed
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, uploadId } = req.body;

  // Validate request body
  if (!userId || !uploadId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ errors: ["User ID and Upload ID are required and must be valid"] });
  }

  try {
    // Connect to MongoDB
    await connectToMongoDB();

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    // Find the upload by its ID within the user's uploads
    const existingUpload = user.uploads.find((upload) => upload._id.equals(new mongoose.Types.ObjectId(uploadId)));
    if (!existingUpload) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }

    // Check if the user has already reported this upload
    existingUpload.reports = existingUpload.reports || [];
    if (existingUpload.reports.some((report) => report.userId.equals(new mongoose.Types.ObjectId(userId)))) {
      return res.status(400).json({ errors: ["Upload already reported by this user"] });
    }

    // Add new report
    existingUpload.reports.push({ userId: new mongoose.Types.ObjectId(userId) });
    existingUpload.reportsCount += 1; // Increment reports count

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: "Upload reported successfully" });
  } catch (error) {
    console.error("Error reporting upload:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
