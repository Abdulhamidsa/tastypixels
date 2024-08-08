﻿import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAccessToken, refreshAccessToken, setAccessToken, removeAccessToken } from "@/utils/auth";
import { checkExistingUsername, checkExistingEmail } from "@/utils/authUtils";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, token: action.payload.token, username: action.payload.username, loading: false };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, token: null, username: null, loading: false };
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
    username: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = getAccessToken();
      let username = null;

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          username = decodedToken.userName;
        } catch (error) {
          console.error("Failed to decode access token:", error);
        }
      } else {
        try {
          accessToken = await refreshAccessToken();
          if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            username = decodedToken.userName;
          }
        } catch {
          dispatch({ type: "LOGOUT" });
          return;
        }
      }

      dispatch({ type: "LOGIN", payload: { token: accessToken, username } });
    };

    checkAuth();
  }, []);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    const username = decodedToken.userName;
    setAccessToken(token);
    dispatch({ type: "LOGIN", payload: { token, username } });
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
      const response = await fetch("http://localhost:8000/auth/signup", {
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
