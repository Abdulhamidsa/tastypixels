import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const jwtSecret = "verysecretekey";

export default async function handler(req, res) {
  cookieParser()(req, res, () => {});
  const token = req.cookies.token;
  if (!token) {
    return res.status(201).json({ loggedIn: false });
  }
  try {
    const userId = jwt.verify(token, jwtSecret);
    return res.status(200).json({ loggedIn: true, userId: userId.userId });
  } catch (error) {
    return res.status(401).json({ loggedIn: false });
  }
}
