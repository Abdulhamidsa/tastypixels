const { connectDB, client } = require("./db.js");
async function fetchData() {
  try {
    // Connect to the MongoDB database
    const dbClient = await connectDB();
    // Access the database and collection
    const db = dbClient.db("tastypixels"); // Change to your database name
    const collection = db.collection("users"); // Change to your collection name
    // Fetch data from the collection
    const data = await collection.find().toArray();
    // Log the data to the console
    console.log("Fetched data:", data);
    // Close the MongoDB connection
    await client.close();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
fetchData();
module.exports = { fetchData };
