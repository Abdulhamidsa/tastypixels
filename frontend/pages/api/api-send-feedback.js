// import connectToMongoDB from "@/backend/database/db";
// import Feedback from "@/backend/models/Feedback";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { feedback } = req.body;

//   if (!feedback || feedback.trim() === "") {
//     return res.status(400).json({ errors: ["Feedback is required"] });
//   }

//   try {
//     await connectToMongoDB();

//     const newFeedback = new Feedback({ feedback });
//     await newFeedback.save();

//     return res.status(200).json({ message: "Feedback received" });
//   } catch (error) {
//     console.error("Error saving feedback to database:", error);
//     return res.status(500).json({ errors: ["Server error"] });
//   }
// }
