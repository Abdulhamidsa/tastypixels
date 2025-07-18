import { getApiUrl } from "@/utils/api";

export const checkExistingUsername = async (username) => {
  try {
    const response = await fetch(getApiUrl("/api/validation/check-username"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking username:", error);
    throw error;
  }
};

export const checkExistingEmail = async (email) => {
  try {
    const response = await fetch(getApiUrl("/api/validation/check-email"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};
