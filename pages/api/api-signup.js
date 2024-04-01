import { IncomingForm } from "formidable";
import bcrypt from "bcrypt";
import user from "../../models/User";
import connectDB from "../../database/db";
import { isValidEmail, isValidPassword, checkExistingUser } from "../../util/validations";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const email = typeof fields.email === "string" ? fields.email : fields.email[0];
    const password = typeof fields.password === "string" ? fields.password : fields.password[0];

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (await checkExistingUser(email)) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const person = new user({
      email: email,
      password: hashedPassword,
    });

    try {
      await person.save();
      return res.status(200).json({ done: true });
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ message: "Error saving user" });
    }
  });
}
