import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
      } catch (error) {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false); // Set isLoggedIn to false if an error occurs
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

  return <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logouts }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
