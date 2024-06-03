import bcrypt from "bcrypt";
import userDemo from "@/models/User";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import connectToMongoDB from "@/database/db";

const jwtSecret = "verysecretekey";

export default async function handler(req, res) {
  try {
    await connectToMongoDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await userDemo.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const userId = user._id;
    const token = jwt.sign({ userId }, jwtSecret);
    // Set the token as a cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/", // root path
      sameSite: "lax", // change to "strict" if needed
      secure: process.env.NODE_ENV === "production", // enable in production
    };

    // Serialize the token as a cookie
    const tokenCookie = serialize("token", token, cookieOptions);
    // Set the cookie in the response headers
    res.setHeader("Set-Cookie", tokenCookie);
    // Include the user ID in the response
    return res.status(200).json({ token, userId, message: "Login successful", success: true });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
