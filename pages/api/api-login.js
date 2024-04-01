import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectDB from "../../database/db";
import { serialize } from "cookie"; // Import serialize function from the cookie package

const jwtSecret = "verysecretekey";

export default async function handler(req, res) {
  await connectDB();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    // Extract the user ID from the user object
    const userId = user._id;

    // Create a JWT token containing the user ID
    const token = jwt.sign({ userId }, jwtSecret);

    // Set the token as a cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week expiration
        path: "/", // root path
        sameSite: "lax", // change to "strict" if needed
        secure: process.env.NODE_ENV === "production", // enable in production
      })
    );

    // Include the user ID in the response
    return res.status(200).json({ token, userId, message: "Login successful", success: true });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(401).json({ message: "Email or Password are incorrect" });
  }
}
