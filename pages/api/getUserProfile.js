import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectToMongoDB from "@/database/db";

const jwtSecret = process.env.JWT_SECRET_KEY;

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToMongoDB();

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.userId).lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
