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
  const response = await fetch("https://tastypixels-production.up.railway.app/auth/refresh-token", {
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
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw error;
    }
  }

  return response;
};

// export const addComment = async (uploadId, commentText) => {
//   try {
//     const response = await fetchWithTokenRefresh("http://localhost:8000/api/add-comment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         uploadId,
//         text: commentText,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to add comment");
//     }

//     const data = await response.json();
//     console.log("Comment added successfully:", data);
//   } catch (error) {
//     console.error("Error adding comment:", error);
//   }
// };
