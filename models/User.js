import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Export the User model using mongoose.model()
export default mongoose.models.User || mongoose.model("User", userSchema);
