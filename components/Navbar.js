import React, { useCallback } from "react";
import { Flex, Button, IconButton, useColorMode, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, ArrowForwardIcon, SunIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "@/components/Signin";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Upload from "@/components/Upload";
import CryptoJS from "crypto-js";

const Navbar = () => {
  const { isLoggedIn, logouts, isLoading, userId } = useAuth();
  const ciphertext = CryptoJS.AES.encrypt(userId, "secret key").toString();

  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
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

  async function logout() {
    try {
      const response = await fetch("/api/api-logout", {
        method: "POST",
      });
      if (response.ok) {
        sessionStorage.removeItem("token");
        console.log("Logout successful");
        logouts();
        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  const handleOpenModal = async (type) => {
    if (type === "logout") {
      try {
        await logout();
      } catch (error) {}
    } else {
      setFormType(type);
      onModalOpen();
      handleMenuClose();
    }
  };

  return (
    <>
      <Flex zIndex="100" position="relative" bg="rgba(0, 0, 0, 0.5)" as="nav" align="center" justify="center" padding="3" backdropFilter="blur(5px)">
        <ChakraLink as={NextLink} color="red.500" href="/" fontWeight="bold" fontSize="xl" mr="auto">
          TASTY PIXELS
        </ChakraLink>
        <IconButton mr={5} aria-label="Open menu" icon={<HamburgerIcon />} size="md" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />
        {isSpecificPage && isLoggedIn && (
          <>
            <Upload isOpen={isUploadOpen} cloeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
            <ChakraLink pr={4} onClick={() => openUpload()}>
              Upload
            </ChakraLink>
          </>
        )}
        <Flex align="center" display={{ base: "none", md: "flex" }} p={3} gap={10}>
          {!isLoggedIn && (
            <>
              <ChakraLink colorScheme="teal" variant="solid" onClick={() => handleOpenModal("signup")}>
                Sign Up
              </ChakraLink>
              <ChakraLink colorScheme="teal" variant="outline" onClick={() => handleOpenModal("signin")}>
                Sign in
              </ChakraLink>
            </>
          )}
          {isLoggedIn && (
            <>
              <ChakraLink onClick={() => handleOpenModal("logout")}>Logout</ChakraLink>
              <ChakraLink as={NextLink} href="/home">
                Food Gallary
              </ChakraLink>
              <ChakraLink as={NextLink} href={`/userProfile/${encodeURIComponent(ciphertext)}`} onClick={onMenuClose}>
                Profile
              </ChakraLink>
            </>
          )}
        </Flex>
        <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size={{ base: "full", md: "half" }}>
          <DrawerOverlay>
            <DrawerContent bg="#212121">
              <DrawerCloseButton />
              <DrawerHeader></DrawerHeader>
              <DrawerBody>
                <VStack spacing="20px">
                  {isLoggedIn && (
                    <>
                      <ChakraLink as={NextLink} href="/home" onClick={onMenuClose}>
                        Food Gallary
                      </ChakraLink>
                      <ChakraLink as={NextLink} href={`/userProfile/${encodeURIComponent(ciphertext)}`} onClick={onMenuClose}>
                        Profile
                      </ChakraLink>

                      <Button
                        onClick={() => {
                          handleOpenModal("logout");
                          onMenuClose();
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  )}

                  {!isLoggedIn && (
                    <>
                      <ChakraLink onClick={() => handleOpenModal("signup")}>Sign Up</ChakraLink>
                      <ChakraLink onClick={() => handleOpenModal("signin")}>Sign in</ChakraLink>
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
