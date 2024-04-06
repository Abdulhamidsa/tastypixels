import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
        setUserId(data.userId);
        console.log("data.loggedIn", data.loggedIn, data.userId.userId);
      } catch (error) {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginStatus();
  }, []);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logouts = () => {
    setIsLoggedIn(false);
    Cookies.remove("token");
  };

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logouts, userId }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
