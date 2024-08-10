import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAccessToken, refreshAccessToken, setAccessToken, removeAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, token: action.payload.token, friendlyId: action.payload.friendlyId, loading: false };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, token: null, friendlyId: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    token: null,
    friendlyId: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = getAccessToken();
      let friendlyId = null;

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          friendlyId = decodedToken.friendlyId;
        } catch (error) {
          console.error("Failed to decode access token:", error);
        }
      } else {
        try {
          accessToken = await refreshAccessToken();
          if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            friendlyId = decodedToken.friendlyId;
          }
        } catch {
          dispatch({ type: "LOGOUT" });
          return;
        }
      }

      if (friendlyId) {
        dispatch({ type: "LOGIN", payload: { token: accessToken, friendlyId } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const friendlyId = decodedToken.friendlyId;
      setAccessToken(token); // Store the token

      dispatch({ type: "LOGIN", payload: { token, friendlyId } }); // Immediately update the state
    } catch (error) {
      console.error("Failed to log in:", error);
      dispatch({ type: "LOGOUT" });
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/api-logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        removeAccessToken();
        dispatch({ type: "LOGOUT" });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const signup = async (signupData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("https://tastypixels-backend.up.railway.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return <AuthContext.Provider value={{ state, dispatch, login, logout, signup }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
