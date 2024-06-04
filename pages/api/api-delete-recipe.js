import User from "@/models/User";
import connectToMongoDB from "@/database/db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, uploadId } = req.body;
  console.log(userId, uploadId);

  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    let user = await User.findById(userIdObj);

    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    user.uploads = user.uploads.filter((upload) => upload._id.toString() !== uploadId);

    await user.save();

    return res.status(200).json({ message: "Upload deleted successfully" });
  } catch (error) {
    console.error("Error deleting upload:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
