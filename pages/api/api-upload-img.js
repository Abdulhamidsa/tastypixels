import dbConnect from "../../database/db";
import Photo from "../../models/Photo";
import { authenticateUser } from "./auth/status";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Destructure the imageUrl, title, description, tags, and category from the request body
  const { imageUrl, title, description, category, tags } = req.body;
  console.log("Request body:", req.body); // Log the request body to check if the data is received correctly
  // console.log("Category:", categories); // Log the categories field
  // console.log(typeof categories); // Log the type of the category field
  try {
    // Connect to the database
    await dbConnect();

    // Authenticate user and get the user ID
    // const userId = await authenticateUser(req);
    // console.log("User ID:", userId); // Log the userId to check if it's retrieved correctly

    // Create a new photo document in the database with all required fields
    const newPhoto = new Photo({
      imageUrl,
      title,
      description,
      category,
      tags,
      // userId, // Pass the extracted user ID
      approved: true, // Set the default value for 'approved'
      // createdAt: Date.now(), // Set the current date for 'createdAt'
    });

    // Save the photo document to the database
    const savedPhoto = await newPhoto.save();
    console.log("Saved photo:", savedPhoto); // Log the saved photo document

    // Return the saved photo document as the API response
    return res.status(201).json(savedPhoto);
  } catch (error) {
    console.error("Error saving photo to database:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
