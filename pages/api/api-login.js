import { IncomingForm } from "formidable";
import { loginUser } from "../../database/auth.js";

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
        const loginResult = await loginUser(email, password);
        console.log("Login result:", loginResult);
        res.status(200).json(loginResult);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
