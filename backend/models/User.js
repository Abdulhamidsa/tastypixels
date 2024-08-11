const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  text: { type: String, required: true },
  username: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
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
  reports: [reportSchema],
  reportsCount: { type: Number, default: 0 },
  postedAt: { type: Date, default: Date.now },
});
const memberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    friendlyId: {
      type: String,
      unique: true,
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
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.models.Member || mongoose.model("Member", memberSchema);
module.exports = UserModel;
