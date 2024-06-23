import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const uploadSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  description: String,
  category: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  countryOfOrigin: String,
  comments: [commentSchema],
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
    comments: [
      {
        uploadId: mongoose.Schema.Types.ObjectId,
        text: String,
        createdAt: { type: Date, default: Date.now },
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
