const jwt = require("jsonwebtoken");

const jwtSecret = "verysecretekey"; // Replace with your actual secret
const refreshSecret = "veryrefreshsecret"; // Replace with your refresh secret

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Authorization Header: ", authHeader); // Debugging
  console.log("Extracted Token: ", token); // Debugging

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle token expiration and refresh token
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, refreshSecret);
        const userId = decodedRefresh.userId;

        const newAccessToken = jwt.sign({ userId: userId }, jwtSecret, { expiresIn: "15m" });
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = jwt.verify(newAccessToken, jwtSecret);
        next();
      } catch (refreshError) {
        return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

module.exports = authenticateToken;
