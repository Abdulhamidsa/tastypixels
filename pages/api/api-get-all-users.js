import connectToMongoDB from "@/database/db";
import clientPromise from "@/database/db";

export default async function handler(req, res) {
  const client = await clientPromise;
  try {
    await client.connect();

    const allData = await client.db().collection(req.query.collection[0]).find({}).toArray();

    return res.send(allData);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
