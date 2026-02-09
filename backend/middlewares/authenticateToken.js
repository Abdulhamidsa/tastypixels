const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        const { userId, username, userRole } = decodedRefresh;
        const newAccessToken = jwt.sign({ userId, username, userRole }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET_KEY);
        next();
      } catch (refreshError) {
        // console.log("Refresh token verification error:", refreshError);
        return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

module.exports = authenticateToken;
