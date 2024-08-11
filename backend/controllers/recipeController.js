const connectToMongoDB = require("@/database/db");
const User = require("@/models/User");

const fetchAllPosts = async (req, res) => {
  try {
    await connectToMongoDB();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const usersData = await User.find({});
    const uniqueUploads = new Map();
    let userData = {};

    if (req.user) {
      const user = await User.findById(req.user._id);
      userData = user ? user.toObject() : {};

      for (const upload of user.uploads) {
        const liked = user.likedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
        const disliked = user.dislikedPosts.some((post) => post.uploadId.toString() === upload._id.toString());

        uniqueUploads.set(upload._id.toString(), {
          ...upload.toObject(),
          _id: upload._id.toString(),
          username: user.username,
          liked,
          disliked,
        });
      }
    }

    for (const user of usersData) {
      const hasLikedPosts = user.likedPosts && Array.isArray(user.likedPosts);
      const hasDislikedPosts = user.dislikedPosts && Array.isArray(user.dislikedPosts);

      for (const upload of user.uploads) {
        const liked = hasLikedPosts && user.likedPosts.some((post) => post.uploadId.toString() === upload._id.toString());
        const disliked = hasDislikedPosts && user.dislikedPosts.some((post) => post.uploadId.toString() === upload._id.toString());

        uniqueUploads.set(upload._id.toString(), {
          ...upload.toObject(),
          _id: upload._id.toString(),
          username: user.username,
          liked,
          disliked,
        });
      }
    }

    const paginatedUploads = Array.from(uniqueUploads.values()).slice(skip, skip + limit);

    res.status(200).json({ uploads: paginatedUploads, userData });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

module.exports = { fetchAllPosts };
