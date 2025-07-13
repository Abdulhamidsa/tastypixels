import { jwtDecode } from "jwt-decode";
import { getApiUrl } from "@/utils/api";

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
    const response = await fetch(getApiUrl("/auth/refresh-token"), {
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
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
    } catch (error) {}
  }

  return response;
};
