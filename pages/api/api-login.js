import bcrypt from "bcrypt";
import User from "@/models/User";
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
    const user = await User.findOneAndUpdate({ email }, { $set: { lastSeen: new Date() } }, { new: true }).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const userId = user._id;
    const username = user.username;

    const token = jwt.sign({ userId }, jwtSecret);

    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    };

    const tokenCookie = serialize("token", token, cookieOptions);
    res.setHeader("Set-Cookie", tokenCookie);
    return res.status(200).json({ token, userId, username, message: "Login successful", success: true });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
