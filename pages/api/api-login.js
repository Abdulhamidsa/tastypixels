import bcrypt from "bcrypt";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { serialize } from "cookie";

const jwtSecret = "verysecretekey";
const DATABASE_NAME = "tastypixels";
const COLLECTION_NAME = "users";

export default async function handler(req, res) {
  // Connect to MongoDB using Mongoose
  await mongoose.connect("mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/" + DATABASE_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { email, password } = req.body;

  if (!email || !password) {
    mongoose.connection.close(); // Close the Mongoose connection
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      mongoose.connection.close(); // Close the Mongoose connection
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      mongoose.connection.close(); // Close the Mongoose connection
      throw new Error("Invalid password");
    }
    const userId = user._id;

    const token = jwt.sign({ userId }, jwtSecret);

    // Set the token as a cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week expiration
      path: "/", // root path
      sameSite: "lax", // change to "strict" if needed
      secure: process.env.NODE_ENV === "production", // enable in production
    };

    // Serialize the token as a cookie
    const tokenCookie = serialize("token", token, cookieOptions);

    // Set the cookie in the response headers
    res.setHeader("Set-Cookie", tokenCookie);

    mongoose.connection.close(); // Close the Mongoose connection

    // Include the user ID in the response
    return res.status(200).json({ token, userId, message: "Login successful", success: true });
  } catch (error) {
    console.error("Error logging in:", error);
    mongoose.connection.close(); // Close the Mongoose connection
    return res.status(401).json({ message: "Email or Password are incorrect" });
  }
}
