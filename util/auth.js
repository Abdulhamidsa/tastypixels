import jwtDecode from "jwt-decode";

const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const refreshAccessToken = async () => {
  const response = await fetch("/api/refresh-token", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }
  const data = await response.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
};

export const decodeToken = (token) => {
  return jwtDecode(token);
};

export const fetchWithTokenRefresh = async (url, options = {}) => {
  const accessToken = getAccessToken();
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw error;
    }
  }

  return response;
};
