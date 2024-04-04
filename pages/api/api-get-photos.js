// api-get-photos.js
import connectDB from "../../database/db";
import ME from "../../models/Photo";

export default async function handler(req, res) {
  //   if (req.method !== "GET") {
  //     return res.status(405).json({ message: "Method Not Allowed" });
  //   }

  try {
    await connectDB();
    const photos = await ME.find({});
    return res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
