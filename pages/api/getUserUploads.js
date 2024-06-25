import connectToMongoDB from "@/database/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    try {
      const db = await connectToMongoDB();
      const user = await db.collection("members").findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
