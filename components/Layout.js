import { Box, Text, Tooltip, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import Navbar from "@/components/Navbar";
import { createContext } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import Demo from "./Demo";

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Box>{children}</Box>
      <Demo />
    </>
  );
}
