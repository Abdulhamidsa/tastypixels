import { client } from "../database/db.js";
async function checkExistingUser(email) {
  try {
    const db = client.db("tastypixels");
    const users = db.collection("users");

    // Check if a user with the provided email already exists
    const existingUser = await users.findOne({ email });
    return existingUser;
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPassword(password) {
  // Add your password validation criteria here
  const minLength = 8; // Minimum password length
  return password.length >= minLength;
}
module.exports = { checkExistingUser, isValidEmail, isValidPassword };
