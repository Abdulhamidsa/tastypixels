import connectToMongoDB from "@/database/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    try {
      const db = await connectToMongoDB();
      const user = await db.collection("userdemos").findOne({ _id: new ObjectId(userId) });

      const uploads = user ? user.uploads.map((upload) => ({ ...upload, _id: upload._id.toString() })) : [];
      res.status(200).json({ uploads });
    } catch (error) {
      console.error("Error fetching uploads:", error);
      res.status(500).json({ error: "Failed to fetch uploads" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
