// Layout.js
import { Box } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import { createContext, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

// Define the LoginContext outside of the Layout component
export const LoginContext = createContext();

export default function Layout({ children }) {
  // Use useState hook to manage isLoggedIn state
  const { isLoggedIn, isLoading } = useAuth();
  // console.log("isLoggedIn", isLoggedIn);
  // console.log("isLoggedIn", isLoggedIn);
  if (isLoading) {
    return <Loading />;
  }
  return (
    // Provide the LoginContext value to children components
    <>
      <Navbar />
      <Box>{children}</Box>
    </>
  );
}
