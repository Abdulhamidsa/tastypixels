import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getAccessToken, refreshAccessToken, setAccessToken, removeAccessToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode"; // Fixed the import

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

          // Check if the token is about to expire (within 5 minutes)
          if (Date.now() >= decodedToken.exp * 1000 - 5 * 60 * 1000) {
            console.log("Token is about to expire, refreshing...");
            accessToken = await refreshAccessToken();

            if (accessToken) {
              setAccessToken(accessToken); // Store the new access token
              const newDecodedToken = jwtDecode(accessToken);
              dispatch({
                type: "LOGIN",
                payload: {
                  token: accessToken,
                  userId: newDecodedToken.userId,
                  userRole: newDecodedToken.userRole,
                  userName: newDecodedToken.userName,
                },
              });
            } else {
              console.error("Failed to refresh access token, logging out.");
              dispatch({ type: "LOGOUT" });
            }
          } else {
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
        } catch (error) {
          console.error("Failed to decode access token, logging out:", error);
          dispatch({ type: "LOGOUT" });
        }
      } else {
        try {
          console.log("No access token found, attempting to refresh...");
          accessToken = await refreshAccessToken();

          if (accessToken) {
            setAccessToken(accessToken);
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
          } else {
            console.error("No refresh token available, logging out.");
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          console.error("Failed to refresh access token, logging out:", error);
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    checkAuth();
  }, []);

  const signin = async (values) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("https://tastypixels-backend.up.railway.app/auth/login", {
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
      const response = await fetch("https://tastypixels-backend.up.railway.app/auth/logout", {
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
