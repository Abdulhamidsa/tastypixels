import { Box, Tooltip, Button, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import Navbar from "@/components/Navbar";
import { createContext } from "react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <Box>{children}</Box>
      <Tooltip label="Demo Info" fontSize="md">
        <IconButton pl={3} bg="red.500" color="" size="lg" aria-label="About this demo" icon={<InfoIcon />} onClick={onOpen} position="fixed" left="-4" _hover={{ left: "0px" }} top="20%" transform="translateY(-50%)" borderRadius="0%" transition="all 0.2s ease-in-out" />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About this demo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>This is a demo website. You can do X, Y, and Z.</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
