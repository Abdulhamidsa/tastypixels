import user from "../models/User.js";
async function checkExistingUser(email) {
  try {
    const count = await user.countDocuments({ email: email });
    return count > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPassword(password) {
  // At least 8 characters long, contains a number
  const passwordRegex = /^(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}
module.exports = { checkExistingUser, isValidEmail, isValidPassword, user };
