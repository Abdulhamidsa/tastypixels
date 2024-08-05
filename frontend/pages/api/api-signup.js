// import bcrypt from "bcrypt";
// import Member from "@/backend/models/User";
// import { isValidEmail, isValidPassword, checkExistingUser } from "@/backend/util/validations";
// import connectToMongoDB from "@/backend/database/db";

// export default async function handler(req, res) {
//   try {
//     await connectToMongoDB();
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Username, email, and password are required" });
//     }

//     if (await checkExistingUser(email)) {
//       return res.status(400).json({ message: "User with this email already exists" });
//     }

//     if (!isValidEmail(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     if (!isValidPassword(password)) {
//       return res.status(400).json({ message: "Password must be at least 8 characters long" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new Member({
//       username: username,
//       email: email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return res.status(200).json({ message: "User successfully created" });
//   } catch (error) {
//     console.error("Error during signup:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
