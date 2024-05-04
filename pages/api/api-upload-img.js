import mongoose from "mongoose";
import User from "../../models/User";
import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { imageUrl, title, description, category, tags, userId } = req.body;
  console.log(userId);
  try {
    await connectToMongoDB();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    let user = await User.findById(userIdObj);
    console.log("User found:", user);
    user.uploads.push({ imageUrl, title, description, category, tags });
    await user.save();
  } catch (error) {
    console.error("Error saving photo to database:", error);
    return res.status(500).json({ error: "Server error" });
  } finally {
    mongoose.connection.close();
  }
}
