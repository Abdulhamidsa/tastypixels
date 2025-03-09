const connectToMongoDB = require("@/database/db");
const User = require("@/models/User");

const fetchTrendingRecipes = async (req, res) => {
  try {
    await connectToMongoDB();
    const limit = parseInt(req.query.limit, 10) || 3;

    const usersWithUploads = await User.find({ uploads: { $exists: true, $ne: [] } });

    if (!usersWithUploads.length) {
      return res.status(200).json({ recipes: [] });
    }

    let allRecipes = [];

    for (const user of usersWithUploads) {
      user.uploads.forEach((upload) => {
        if (upload.imageUrl) {
          const totalEngagement = (upload.likes || 0) + (upload.comments?.length || 0);

          allRecipes.push({
            _id: upload._id.toString(),
            pic: upload.imageUrl,
            username: user.username,
            title: upload.title,
            avatar: user.avatar || "",
            engagement: totalEngagement,
          });
        }
      });
    }

    if (allRecipes.length === 0) {
      return res.status(200).json({ recipes: [] });
    }

    allRecipes = allRecipes.sort((a, b) => b.engagement - a.engagement).slice(0, limit);

    res.status(200).json({ recipes: allRecipes });
  } catch (error) {
    console.error("Error fetching trending recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

module.exports = { fetchTrendingRecipes };
