const user = require("@/models/User");
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
  const passwordRegex = /^(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}
module.exports = { checkExistingUser, isValidEmail, isValidPassword, user };
