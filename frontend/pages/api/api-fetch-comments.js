// import mongoose from "mongoose";
// import connectToMongoDB from "@/backend/database/db";
// import User from "@/backend/models/User";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { uploadId } = req.query;

//   if (!mongoose.Types.ObjectId.isValid(uploadId)) {
//     return res.status(400).json({ errors: ["Invalid uploadId"] });
//   }

//   try {
//     await connectToMongoDB();

//     const userWithUpload = await User.findOne({ "uploads._id": uploadId });
//     if (!userWithUpload) {
//       return res.status(404).json({ errors: ["User not found for the upload"] });
//     }

//     const upload = userWithUpload.uploads.id(uploadId);
//     if (!upload) {
//       return res.status(404).json({ errors: ["Upload not found"] });
//     }

//     const comments = upload.comments;
//     return res.status(200).json(comments);
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return res.status(500).json({ errors: ["Server error"] });
//   }
// }
