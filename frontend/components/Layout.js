import Navbar from "@/components/Navbar";
import { createContext } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { Box } from "@chakra-ui/react";
import Footer from "./Footer";
import BackToPortfolioButton from "./BackToPortfolioButton";

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { state } = useAuth();
  const { isLoading, userName } = state;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <BackToPortfolioButton />
        {children}
        <Footer />
      </Box>
    </>
  );
}
