const bcrypt = require("bcrypt");
const User = require("@/models/User");
const connectToMongoDB = require("@/database/db");
const { checkExistingUser, checkExistingUsername, isValidEmail, isValidPassword, generateFriendlyId } = require("@/utils/validations");
require("dotenv").config();

const signupHandler = async (req, res) => {
  try {
    await connectToMongoDB();
    console.log("Connected to MongoDB");

    const { username, email, password } = req.body;
    console.log("Received data:", { username, email, password });

    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    if (await checkExistingUser(email)) {
      console.log("Email already exists");
      return res.status(400).json({ message: "User with this email already exists" });
    }

    if (await checkExistingUsername(username)) {
      console.log("Username already exists");
      return res.status(400).json({ message: "Username already exists" });
    }

    if (!isValidEmail(email)) {
      console.log("Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      console.log("Invalid password format");
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one number" });
    }

    const friendlyId = await generateFriendlyId(username);
    console.log("Generated friendly ID:", friendlyId);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      friendlyId,
    });

    await newUser.save();
    console.log("User successfully created:", newUser);

    return res.status(200).json({ message: "User successfully created" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { signupHandler };
