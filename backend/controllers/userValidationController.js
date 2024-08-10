const User = require("../models/User");
const connectToMongoDB = require("../database/db");

const checkUsernameExists = async (req, res) => {
  try {
    await connectToMongoDB();
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username }).lean();
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking username existence:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkEmailExists = async (req, res) => {
  try {
    await connectToMongoDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).lean();
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { checkUsernameExists, checkEmailExists };
