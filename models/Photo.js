import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  // _id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: () => new mongoose.Types.ObjectId(), // Generate a new ObjectId for each upload
  // },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  loveCount: {
    type: Number,
    default: 0,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Use userId as the _id field
  },
  uploads: [uploadSchema], // Array to store multiple uploads
});
export default mongoose.models.fuck || mongoose.model("fuck", userSchema);
