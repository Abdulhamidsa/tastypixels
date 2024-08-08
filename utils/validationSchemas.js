import * as Yup from "yup";
import { checkExistingUsername, checkExistingEmail } from "@/utils/authUtils";

const passwordValidationRegex = /^(?=.*\d)[a-zA-Z\d]{8,}$/;

export const signupValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .test("checkUsernameExists", "Username already exists", async (value) => {
      if (!value) return true;
      const exists = await checkExistingUsername(value);
      return !exists;
    }),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test("checkEmailExists", "Email already exists", async (value) => {
      if (!value) return true;
      const exists = await checkExistingEmail(value);
      return !exists;
    }),
  password: Yup.string().matches(passwordValidationRegex, "Password must be at least 8 characters long and contain at least one number").required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Repeat password is required"),
});
