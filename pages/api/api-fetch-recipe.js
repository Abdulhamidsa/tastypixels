import connectToMongoDB from "@/database/db";
export default async function handler(req, res) {
  try {
    const db = await connectToMongoDB();
    const usersData = await db.collection("members").find({}).toArray();
    const enhancedUploads = [];
    for (const user of usersData) {
      const hasLikedPosts = user.likedPosts && Array.isArray(user.likedPosts);
      const hasDislikedPosts = user.dislikedPosts && Array.isArray(user.dislikedPosts);
      if (hasLikedPosts || hasDislikedPosts) {
        for (const upload of user.uploads) {
          let liked = false;
          let disliked = false;
          if (hasLikedPosts) {
            liked = user.likedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
          }
          if (hasDislikedPosts) {
            disliked = user.dislikedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
          }
          enhancedUploads.push({
            ...upload,
            _id: upload._id.toString(),
            userId: user._id.toString(),
            username: user.username,
            liked,
            disliked,
          });
        }
      } else {
        for (const upload of user.uploads) {
          enhancedUploads.push({
            ...upload,
            _id: upload._id.toString(),
            userId: user._id.toString(),
            username: user.username,
            liked: false,
            disliked: false,
          });
        }
      }
    }
    res.status(200).json(enhancedUploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
}
