import jwtDecode from "jwt-decode";

const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const refreshAccessToken = async () => {
  try {
    const response = await fetch("https://tastypixels-backend.up.railway.app/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};

export const decodeToken = (token) => {
  return jwtDecode(token);
};

export const fetchWithTokenRefresh = async (url, options = {}) => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    console.log("No access token found, attempting to refresh...");
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      throw new Error("Failed to retrieve or refresh access token.");
    }
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    console.log("Access token expired, attempting to refresh...");
    try {
      accessToken = await refreshAccessToken();
      if (accessToken) {
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
      } else {
        throw new Error("Failed to refresh access token.");
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      throw error;
    }
  }

  if (!response.ok) {
    console.error(`Request failed with status ${response.status}: ${response.statusText}`);
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response;
};
