const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token from header:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;
      console.log("Refresh token:", refreshToken);

      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        console.log("Decoded refresh token:", decodedRefresh);
        const userId = decodedRefresh.userId;
        const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });

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

module.exports = authenticateToken;
