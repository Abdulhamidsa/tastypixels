export const checkExistingUsername = async (username) => {
  try {
    const response = await fetch("https://tastypixels-backend.up.railway.app/api/validation/check-username", {
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
    const response = await fetch("https://tastypixels-backend.up.railway.app/api/validation/check-email", {
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
