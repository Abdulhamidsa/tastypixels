import connectToMongoDB from "../../database/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { userId } = req.body;
  console.log(userId);

  try {
    const db = await connectToMongoDB();

    // Find documents where userId matches the provided userId
    const documentsToDelete = await db
      .collection("gs")
      .find({ _id: new ObjectId(userId) })
      .toArray();
    console.log(documentsToDelete);
    const documentIdsToDelete = documentsToDelete.map((doc) => doc._id);
    console.log(documentIdsToDelete);

    // Delete documents based on their _id values
    await db.collection("gs").deleteMany({ _id: { $in: documentIdsToDelete } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing photos by userId:", error);
    res.status(500).json({ success: false, error: "Error removing photos" });
  }
}
