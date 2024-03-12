const { client } = require("./db.js");
const bcrypt = require("bcrypt");

async function registerUser(email, password) {
  try {
    const db = client.db("tastypixels"); // replace with your database name
    const users = db.collection("users"); // replace with your collection name

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({ email, password: hashedPassword });
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const db = client.db("tastypixels"); // replace with your database name
    const users = db.collection("users"); // replace with your collection name

    const user = await users.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the passwords directly
    if (password !== user.password) {
      throw new Error("Invalid password");
    }

    return { message: "Login successful" };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

module.exports = { registerUser, loginUser };
