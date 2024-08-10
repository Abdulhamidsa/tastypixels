import Navbar from "@/components/Navbar";
import { createContext } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Demo from "@/components/Demo";
import { Box, Text } from "@chakra-ui/react";
import Footer from "./Footer";

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        {children}
        <Footer />
        {/* <Demo /> */}
      </Box>
    </>
  );
}
