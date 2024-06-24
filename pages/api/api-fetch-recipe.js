import connectToMongoDB from "@/database/db";

export default async function handler(req, res) {
  try {
    const db = await connectToMongoDB();
    const usersData = await db.collection("us").find({}).toArray();

    // Array to store enhanced uploads data
    const enhancedUploads = [];

    // Iterate through each user document
    for (const user of usersData) {
      // Check if the user has likedPosts or dislikedPosts arrays
      const hasLikedPosts = user.likedPosts && Array.isArray(user.likedPosts);
      const hasDislikedPosts = user.dislikedPosts && Array.isArray(user.dislikedPosts);

      // If the user has liked or disliked posts, iterate through their uploads
      if (hasLikedPosts || hasDislikedPosts) {
        for (const upload of user.uploads) {
          // Initialize liked and disliked flags
          let liked = false;
          let disliked = false;

          // Check if the current upload exists in likedPosts or dislikedPosts of the current user
          if (hasLikedPosts) {
            liked = user.likedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
          }
          if (hasDislikedPosts) {
            disliked = user.dislikedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
          }
          // Push enhanced upload data to the array
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
        // If user has no liked or disliked posts, still push their uploads with default liked/disliked flags
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

    // Send response with enhanced uploads data
    res.status(200).json(enhancedUploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
}
