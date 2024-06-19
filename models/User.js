import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  description: String,
  category: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  countryOfOrigin: String, // New field for country of origin
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: "user",
    },
    uploads: [uploadSchema],
    likedPosts: [
      {
        uploadId: mongoose.Schema.Types.ObjectId,
        liked: Boolean,
      },
    ],
    dislikedPosts: [
      {
        uploadId: mongoose.Schema.Types.ObjectId,
        disliked: Boolean,
      },
    ],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
