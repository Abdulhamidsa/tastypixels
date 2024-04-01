// import jwt from "jsonwebtoken";
// import { parse } from "cookie"; // Import parse function from the cookie package

// const jwtSecret = "verysecretekey";

// export function getUserIdFromToken(req) {
//   const cookies = parse(req.headers.cookie || ""); // Parse the cookies from the request
//   const token = cookies.token; // Get the token from the cookies

//   if (!token) {
//     return null; // Return null if token is not present
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret); // Verify the token
//     return decoded.userId; // Extract and return the user ID
//   } catch (error) {
//     return null; // Return null if token is invalid or expired
//   }
// }
