// Layout.js
import { Box } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Box>
        {children}
      </Box>
    </>
  );
}