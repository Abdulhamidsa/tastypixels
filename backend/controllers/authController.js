const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");
require("dotenv").config();

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, userRole: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
};

const loginHandler = async (req, res) => {
  try {
    await connectToMongoDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
  }
};

const logoutHandler = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });
  return res.status(200).json({ message: "Logout successful", success: true });
};

module.exports = { loginHandler, refreshAccessToken, logoutHandler };
