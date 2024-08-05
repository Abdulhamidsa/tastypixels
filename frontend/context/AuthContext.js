import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAccessToken, refreshAccessToken, setAccessToken, removeAccessToken, decodeToken } from "@/util/auth";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, token: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, token: null, loading: false };
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
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = getAccessToken();
      if (!accessToken) {
        try {
          accessToken = await refreshAccessToken();
        } catch {
          dispatch({ type: "LOGOUT" });
          return;
        }
      }
      dispatch({ type: "LOGIN", payload: accessToken });
    };

    checkAuth();
  }, []);

  const login = (token) => {
    setAccessToken(token);
    dispatch({ type: "LOGIN", payload: token });
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

  return <AuthContext.Provider value={{ state, dispatch, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
