const mongoose = require("mongoose");
const { client } = require("./db.js");
const bcrypt = require("bcrypt");

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// async function registerUser(email, password) {
//   try {
//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ email, password: hashedPassword });
//     const result = await user.save();
//     return result;
//   } catch (error) {
//     console.error("Error registering user:", error);
//     throw error;
//   }
// }

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    return { message: "Login successful" };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

module.exports = { loginUser };
