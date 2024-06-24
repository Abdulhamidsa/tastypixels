import mongoose from "mongoose";
import User from "@/models/User";
import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, commentId } = req.body;

  if (!userId || !commentId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ errors: ["Invalid userId or commentId"] });
  }

  try {
    await connectToMongoDB();

    // Find the user and validate if the comment belongs to the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    // Find the upload containing the comment
    const uploadWithComment = user.uploads.find((upload) => {
      return upload.comments.some((comment) => comment._id.toString() === commentId);
    });

    if (!uploadWithComment) {
      return res.status(404).json({ errors: ["Comment not found"] });
    }

    // Find and remove the comment
    const commentIndex = uploadWithComment.comments.findIndex((comment) => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ errors: ["Comment not found"] });
    }

    uploadWithComment.comments.splice(commentIndex, 1); // Remove the comment from the array

    await user.save(); // Save the user object with the updated comments array

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ errors: ["Server error"] });
  }
}
