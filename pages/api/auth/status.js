import jwt from "jsonwebtoken";
// import User from "../../../models/User";
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
    return res.status(200).json({ loggedIn: true, userId });
  } catch (error) {
    return res.status(401).json({ loggedIn: false });
  }
}
// import jwt from "jsonwebtoken";
// import { parse } from "cookie";

// const jwtSecret = "verysecretekey";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   // Log the entire headers to check if the cookie header is present
//   // console.log("Headers:", req.headers);

//   // Parse the cookies from the headers
//   const cookies = parse(req.headers.cookie || "");

//   // Log the parsed cookies to check if the token is present
//   console.log("Cookies:", cookies);

//   const token = cookies.token;
//   console.log("Token:", token);

//   if (!token) {
//     return res.status(401).json({ message: "Token not found" });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, jwtSecret);
//     // Log the decoded token to check if it's correct
//     console.log("Decoded token:", decoded);
//     // Extract the user ID from the token
//     const userId = decoded.userId;

//     return res.status(200).json({ userId, message: "Token is valid", LoggedIn: true });
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return res.status(401).json({ message: "Token is invalid" });
//   }
// }
