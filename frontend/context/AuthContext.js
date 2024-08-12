import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAccessToken, refreshAccessToken, setAccessToken, removeAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        userId: action.payload.userId,
        userRole: action.payload.userRole,
        userName: action.payload.userName,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        userId: null,
        userRole: null,
        userName: null,
        loading: false,
      };
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
    userId: null,
    userRole: null,
    userName: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = getAccessToken();

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          dispatch({
            type: "LOGIN",
            payload: {
              token: accessToken,
              userId: decodedToken.userId,
              userRole: decodedToken.userRole,
              userName: decodedToken.userName,
            },
          });
        } catch (error) {
          console.error("Failed to decode access token:", error);
        }
      } else {
        try {
          accessToken = await refreshAccessToken();
          if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            dispatch({
              type: "LOGIN",
              payload: {
                token: accessToken,
                userId: decodedToken.userId,
                userRole: decodedToken.userRole,
                userName: decodedToken.userName,
              },
            });
          }
        } catch {
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    checkAuth();
  }, []);

  const signin = async (values) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.accessToken;
        const decodedToken = jwtDecode(token);

        setAccessToken(token);
        dispatch({
          type: "LOGIN",
          payload: {
            token,
            userId: decodedToken.userId,
            userRole: decodedToken.userRole,
            userName: decodedToken.userName,
          },
        });

        return { success: true };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });

    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
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
        // Handle successful signup if needed
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

  return <AuthContext.Provider value={{ state, dispatch, signin, logout, signup }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
