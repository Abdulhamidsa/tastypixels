import connectToMongoDB from "@/database/db";
import User from "@/models/User"; // Adjust path as needed
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, uploadId } = req.body;

  if (!userId || !uploadId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(uploadId)) {
    return res.status(400).json({ errors: ["User ID and Upload ID are required and must be valid"] });
  }

  try {
    await connectToMongoDB();

    // Find the user who owns the upload
    const user = await User.findOne({ "uploads._id": uploadId });
    if (!user) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }

    // Find the specific upload within the user's uploads
    const existingUpload = user.uploads.id(uploadId);
    if (!existingUpload) {
      return res.status(404).json({ errors: ["Upload not found"] });
    }

    // Ensure the reports array is initialized
    existingUpload.reports = existingUpload.reports || [];

    // Check if the upload has already been reported by this user
    if (existingUpload.reports.some((report) => report.userId.equals(new mongoose.Types.ObjectId(userId)))) {
      return res.status(402).json({ errors: ["Upload already reported by this user"] });
    }

    // Add the report and increment the reports count
    existingUpload.reports.push({ userId: new mongoose.Types.ObjectId(userId) });
    existingUpload.reportsCount += 1;

    // Save the changes
    await user.save();

    return res.status(200).json({ message: "Upload reported successfully" });
  } catch (error) {
    console.error("Error reporting upload:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
