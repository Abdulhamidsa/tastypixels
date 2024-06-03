import mongoose from "mongoose";
const uploadSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  description: String,
  category: String,
  tags: [String],
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
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", userSchema);
