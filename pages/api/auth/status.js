// pages/api/auth/status.js

import jwt from "jsonwebtoken";
import connectDB from "../../../database/db";
import User from "../../../models/User";

const jwtSecret = "verysecretekey";

export default async function handler(req, res) {
  try {
    await connectDB();

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.userId;

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ loggedIn: false });
      }

      // If user exists, return login status
      return res.status(200).json({ loggedIn: true, userId });
    } catch (error) {
      // Handle JWT verification errors (e.g., invalid token, expired token)
      return res.status(401).json({ loggedIn: false });
    }
  } catch (error) {
    // Handle other potential errors (e.g., database connection error)
    return res.status(500).json({ error: "Internal server error" });
  }
}
