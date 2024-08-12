const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const connectToMongoDB = require("../database/db");
const { generateFriendlyId } = require("../utils/validations");
require("dotenv").config();

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      friendlyId: user.friendlyId,
      userName: user.username,
      userId: user._id,
      userRole: user.userRole,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      friendlyId: user.friendlyId,
      userName: user.username,
      userId: user._id,
      userRole: user.userRole,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

const loginHandler = async (req, res) => {
  try {
    await connectToMongoDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.friendlyId) {
      const friendlyId = await generateFriendlyId(user.username);
      user = await User.findOneAndUpdate({ _id: user._id }, { friendlyId }, { new: true }).lean();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      friendlyId: user.friendlyId,
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
    const user = await User.findOne({ friendlyId: decoded.friendlyId }).lean();
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
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  });
  return res.status(200).json({ message: "Logout successful", success: true });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
      }
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        const newAccessToken = generateAccessToken(decodedRefresh);
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET_KEY);
        next();
      } catch (refreshError) {
        console.log("Refresh token verification error:", refreshError);
        return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

module.exports = { loginHandler, refreshAccessToken, logoutHandler, authenticateToken };
