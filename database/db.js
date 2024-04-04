const mongoose = require("mongoose");

async function connectDB() {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const databaseName = process.env.DB_NAME;
  const clusterUrl = process.env.DB_CLUSTER_URL;

  if (!username || !password || !databaseName || !clusterUrl) {
    console.error("Missing required connection parameters for MongoDB connection.");
    process.exit(1); // Exit the process if any required parameter is missing
  }

  const DATABASE_URL = `mongodb+srv://${username}:${password}@${clusterUrl}/${databaseName}?retryWrites=true&w=majority`;

  try {
    const connection = await mongoose.connect(DATABASE_URL);
    console.log("You successfully connected to MongoDB!");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = connectDB;
