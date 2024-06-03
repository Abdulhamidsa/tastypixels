import mongoose from "mongoose";
const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/tastypixels");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
export default connectToMongoDB;
