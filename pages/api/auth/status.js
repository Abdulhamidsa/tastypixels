// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import connectToMongoDB from "@/backend/database/db";
// import { ObjectId } from "mongodb";

// const jwtSecret = "verysecretekey";

// export default async function handler(req, res) {
//   cookieParser()(req, res, () => {});
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(201).json({ loggedIn: false });
//   }
//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     const userId = decoded.userId;

//     const db = await connectToMongoDB();
//     const user = await db.collection("members").findOne({ _id: new ObjectId(userId) }, { projection: { likedPosts: 1, dislikedPosts: 1 } });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.status(200).json({
//       loggedIn: true,
//       userId: userId,
//       likedPosts: user.likedPosts || [],
//       dislikedPosts: user.dislikedPosts || [],
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(401).json({ loggedIn: false });
//   }
// }
