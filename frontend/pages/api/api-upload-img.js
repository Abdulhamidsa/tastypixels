// import userDemo from "@/backend/models/User";
// import connectToMongoDB from "@/backend/database/db";
// import mongoose from "mongoose";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { imageUrl, title, description, category, tags, userId } = req.body;
//   // console.log("Received userId:", userId);

//   try {
//     await connectToMongoDB();
//     const userIdObj = new mongoose.Types.ObjectId(userId);
//     let user = await userDemo.findById(userIdObj);

//     if (!user) {
//       return res.status(404).json({ errors: ["User not found"] });
//     }

//     console.log("Current number of uploads:", user.uploads.length);

//     if (user.uploads.length >= 4) {
//       return res.status(400).json({ errors: ["Uploads Limit reached! Remove some uploads from your profile to add more."] });
//     }
//     const newData = {
//       _id: new mongoose.Types.ObjectId(),
//       imageUrl,
//       title,
//       description,
//       category,
//       tags,
//     };
//     user.uploads.push(newData);
//     await user.save();

//     return res.status(200).json({ message: "Upload saved successfully" });
//   } catch (error) {
//     console.error("Error saving photo to database:", error);
//     return res.status(500).json({ errors: ["Server error"] });
//   }
// }
