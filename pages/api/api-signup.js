// api/signup.js
import { IncomingForm } from "formidable";
import { registerUser } from "../../database/auth.js";
import { checkExistingUser, isValidEmail, isValidPassword } from "../../util/validations.js"; // Import the functions

const bcrypt = require("bcrypt");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      console.log("Parsed fields:", fields); // Log the parsed fields
      try {
        const email = fields.email[0];
        const password = fields.password[0];

        // Validate the email and password before proceeding
        if (!isValidEmail(email)) {
          res.status(400).json({ error: "Invalid email format" });
          return;
        }

        if (!isValidPassword(password)) {
          res.status(400).json({ error: "Password must be at least 8 characters long" });
          return;
        }

        // Check if the email already exists in the database
        const existingUser = await checkExistingUser(email);
        if (existingUser) {
          res.status(400).json({ error: "A user with this email already exists" });
          return;
        }

        // Hash the password before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Call the registerUser function to register the user with the hashed password
        const result = await registerUser(email, hashedPassword);
        console.log("Registration result:", result);
        res.status(200).json({ message: "User registered successfully" });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
