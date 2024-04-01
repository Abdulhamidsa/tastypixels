// pages/api/auth/status.js

import jwt from "jsonwebtoken";
import connectDB from "../../../database/db";
import User from "../../../models/User";

const jwtSecret = "verysecretekey";

export async function authenticateUser(req) {
  await connectDB();

  const token = req.cookies.token;

  if (!token) {
    return null; // Return null if token is not present
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId;

    return userId; // Return the userId if authentication is successful
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null; // Return null if authentication fails
  }
}
