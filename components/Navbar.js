import React, { useCallback, useState } from "react";
import { Flex, Button, IconButton, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, Spinner } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "@/components/Signin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Upload from "@/components/Upload";
import CryptoJS from "crypto-js";

const Navbar = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, loading, user } = state;
  // const ciphertext = isAuthenticated ? CryptoJS.AES.encrypt(user.userId, "secret key").toString() : null;
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [formType, setFormType] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  const isSpecificPage = router.pathname === "/home";

  const openUpload = () => {
    setIsUploadOpen(true);
  };

  const handleMenuClose = useCallback(() => {
    onMenuClose();
  }, [onMenuClose]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleOpenModal = (type) => {
    if (type === "logout") {
      handleLogout();
    } else {
      setFormType(type);
      onModalOpen();
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Flex zIndex="100" position="relative" bg="rgba(0, 0, 0, 0.5)" as="nav" align="center" justify="center" padding="3" backdropFilter="blur(5px)">
        <ChakraLink as={NextLink} color="red.500" href="/" fontWeight="bold" fontSize="xl" mr="auto">
          TASTY PIXELS
        </ChakraLink>
        <IconButton mr={5} aria-label="Open menu" icon={<HamburgerIcon />} size="md" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />
        {isSpecificPage && isAuthenticated && (
          <>
            <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
            <ChakraLink pr={4} onClick={() => openUpload()}>
              Upload
            </ChakraLink>
          </>
        )}
        <Flex align="center" display={{ base: "none", md: "flex" }} p={3} gap={10}>
          {!isAuthenticated && (
            <>
              <ChakraLink colorScheme="teal" variant="solid" onClick={() => handleOpenModal("signup")}>
                Sign Up
              </ChakraLink>
              <ChakraLink colorScheme="teal" variant="outline" onClick={() => handleOpenModal("signin")}>
                Sign In
              </ChakraLink>
            </>
          )}
          {isAuthenticated && (
            <>
              <ChakraLink onClick={() => handleOpenModal("logout")}>Logout</ChakraLink>

              {/* <ChakraLink as={NextLink} href={`/tp/${encodeURIComponent(ciphertext)}`} onClick={onMenuClose}>
                Profile
              </ChakraLink> */}
            </>
          )}
          <ChakraLink as={NextLink} href="/home">
            Food Gallery
          </ChakraLink>
        </Flex>
        <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size={{ base: "full", md: "half" }}>
          <DrawerOverlay>
            <DrawerContent bg="#212121">
              <DrawerCloseButton />
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <VStack spacing="20px">
                  <ChakraLink as={NextLink} href="/home" onClick={onMenuClose}>
                    Food Gallery
                  </ChakraLink>
                  {isAuthenticated && (
                    <>
                      {/* <ChakraLink as={NextLink} href={`/userProfile/${encodeURIComponent(ciphertext)}`} onClick={onMenuClose}>
                        Profile
                      </ChakraLink> */}
                      <Button onClick={() => handleOpenModal("logout")}>Logout</Button>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <ChakraLink onClick={() => handleOpenModal("signup")}>Sign Up</ChakraLink>
                      <ChakraLink onClick={() => handleOpenModal("signin")}>Sign In</ChakraLink>
                    </>
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent maxW={["90vw", "70vw", "50vw", "40vw"]}>
          <ModalHeader>{formType === "logout" ? "Logout" : formType === "signup" ? "Sign Up" : "Sign In"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formType === "signup" ? (
              <SignUp isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} setFormType={setFormType} />
            ) : formType === "signin" ? (
              <Signin isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} setFormType={setFormType} />
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
