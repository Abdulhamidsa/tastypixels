import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  const db = await connectToMongoDB();
  const data = await db.collection("userdemos").find({}).toArray();

  const uploads = [];
  data.forEach((doc) => {
    if (doc.uploads) {
      doc.uploads.forEach((upload) => {
        uploads.push({
          ...upload,
          _id: upload._id.toString(),
          userId: doc._id.toString(),
          username: doc.username,
        });
      });
    }
  });

  res.status(200).json(uploads);
}
