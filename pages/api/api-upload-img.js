import mongoose from "mongoose"; // Import mongoose
import Photo from "../../models/Photo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Destructure the imageUrl, title, description, tags, and category from the request body
  const { imageUrl, title, description, category, tags } = req.body;
  console.log("Request body:", req.body); // Log the request body to check if the data is received correctly

  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect("mongodb+srv://aboood:UNBFqjTpLgeUMQkl@cluster0.bn3dcrh.mongodb.net/tastypixels");
    const newPhoto = new Photo({
      imageUrl,
      title,
      description,
      category,
      tags,
      approved: true, // Set the default value for 'approved'
    });
    const savedPhoto = await newPhoto.save();
    console.log("Saved photo:", savedPhoto); // Log the saved photo document
    await mongoose.connection.close();

    // Return the saved photo document as the API response
    return res.status(201).json(savedPhoto);
  } catch (error) {
    console.error("Error saving photo to database:", error);
    // Close the Mongoose connection
    await mongoose.connection.close();
    return res.status(500).json({ error: "Server error" });
  }
}
