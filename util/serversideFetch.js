import connectToMongoDB from "@/backend/database/db";

export async function fetchUploads() {
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

  return uploads;
}

export async function getServerSideProps() {
  const uploads = await fetchUploads();

  return {
    props: { uploads },
  };
}
