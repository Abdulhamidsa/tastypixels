const User = require("@/models/User");
import { nanoid } from "nanoid";

async function checkExistingUser(email) {
  try {
    const count = await User.countDocuments({ email: email });
    return count > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error;
  }
}

async function checkExistingUsername(username) {
  try {
    const count = await User.countDocuments({ username: username });
    return count > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
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

const generateFriendlyId = async (username) => {
  const baseId = username.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const randomNumber = Math.floor(Math.random() * 1000);
  let friendlyId = `${baseId}-${randomNumber}-${nanoid(5)}`;
  let isUnique = false;
  while (!isUnique) {
    const existingUser = await User.findOne({ friendlyId }).lean();
    if (existingUser) {
      friendlyId = `${baseId}-${randomNumber}-${nanoid(5)}`;
    } else {
      isUnique = true;
    }
  }
  return friendlyId;
};
module.exports = { checkExistingUser, generateFriendlyId, checkExistingUsername, isValidEmail, isValidPassword };
