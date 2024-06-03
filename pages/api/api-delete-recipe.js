// import connectToMongoDB from "../../database/db";
// import { ObjectId } from "mongodb";

// export default async function handler(req, res) {
//   try {
//     // Validate input
//     const { userId, uploadId } = req.body;
//     if (!userId || !uploadId) {
//       return res.status(400).json({ success: false, error: "Missing userId or uploadId in request body" });
//     }
//     const db = await connectToMongoDB();
//     const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found for the given userId" });
//     }
//     const uploadIndex = user.uploads.findIndex((upload) => upload._id.toString() === uploadId);
//     if (uploadIndex === -1) {
//       return res.status(404).json({ success: false, error: "Upload not found for the given uploadId" });
//     }

//     user.uploads.splice(uploadIndex, 1);

//     await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { uploads: user.uploads } });

//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error removing upload by uploadId:", error);
//     res.status(500).json({ success: false, error: "Error removing upload" });
//   }
// }

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
