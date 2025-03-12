import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useRouter } from "next/router";
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

  const router = useRouter();

  useEffect(() => {
    // Detect if "from=portfolio" is in the URL
    if (router.query.from === "portfolio") {
      sessionStorage.setItem("fromPortfolio", "true"); // Store it
    }

    // If "from=portfolio" is missing but exists in sessionStorage, restore it
    if (!router.query.from && sessionStorage.getItem("fromPortfolio") === "true") {
      router.replace({ pathname: router.pathname, query: { ...router.query, from: "portfolio" } }, undefined, { shallow: true });
    }
  }, [router.query]);

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

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
