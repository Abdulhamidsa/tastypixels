const connectToMongoDB = require("../database/db");
const UserModel = require("../models/User");

const fetchAllPosts = async (req, res) => {
  try {
    await connectToMongoDB();
    const usersData = await UserModel.find({});
    const enhancedUploads = [];

    for (const user of usersData) {
      const hasLikedPosts = user.likedPosts && Array.isArray(user.likedPosts);
      const hasDislikedPosts = user.dislikedPosts && Array.isArray(user.dislikedPosts);

      for (const upload of user.uploads) {
        let liked = false;
        let disliked = false;

        if (hasLikedPosts) {
          liked = user.likedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
        }
        if (hasDislikedPosts) {
          disliked = user.dislikedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
        }
        // const commentsWithUsernames = upload.comments.map((comment) => {
        //   const commenter = usersData.find((u) => u._id.toString() === comment.userId.toString());
        //   return {
        //     ...comment.toObject(),
        //     userId: undefined,
        //     username: commenter ? commenter.username : "Unknown",
        //   };
        // });

        enhancedUploads.push({
          ...upload.toObject(),
          _id: upload._id.toString(),
          username: user.username,
          liked,
          disliked,
          // comments: commentsWithUsernames,
        });
      }
    }

    res.status(200).json(enhancedUploads);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

module.exports = { fetchAllPosts };
