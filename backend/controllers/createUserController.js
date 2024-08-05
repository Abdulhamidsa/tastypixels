const bcrypt = require("bcrypt");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");
const { isValidEmail, isValidPassword, checkExistingUser } = require("@/util/validations");
require("dotenv").config();

const signupHandler = async (req, res) => {
  try {
    await connectToMongoDB();
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }
    if (await checkExistingUser(email)) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one number" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json({ message: "User successfully created" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { signupHandler };
