// import mongoose from "mongoose";
// import User from "@/backend/models/User";
// import connectToMongoDB from "@/backend/database/db";

// export default async function handler(req, res) {
//   if (req.method !== "DELETE") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { userId, commentId } = req.body;

//   if (!userId || !commentId || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(commentId)) {
//     return res.status(400).json({ errors: ["Invalid userId or commentId"] });
//   }

//   try {
//     await connectToMongoDB();

//     let commentDeleted = false;

//     // Search through all users
//     const users = await User.find();
//     for (let user of users) {
//       // Find the upload containing the comment
//       const uploadWithComment = user.uploads.find((upload) => {
//         return upload.comments.some((comment) => comment._id.toString() === commentId);
//       });

//       if (uploadWithComment) {
//         // Find and remove the comment
//         const commentIndex = uploadWithComment.comments.findIndex((comment) => comment._id.toString() === commentId);
//         if (commentIndex !== -1) {
//           uploadWithComment.comments.splice(commentIndex, 1); // Remove the comment from the array
//           await user.save(); // Save the user object with the updated comments array
//           commentDeleted = true;
//           break; // Exit the loop once the comment is found and deleted
//         }
//       }
//     }

//     if (!commentDeleted) {
//       return res.status(404).json({ errors: ["Comment not found"] });
//     }

//     return res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     return res.status(500).json({ errors: ["Server error"] });
//   }
// }
