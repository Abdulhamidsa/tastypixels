import React, { useCallback } from "react";
import { Flex, IconButton, useColorMode, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, ArrowForwardIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "./Signin";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Upload from "@/components/Upload";

const Navbar = () => {
  const { isLoggedIn, logouts, isLoading, userId } = useAuth();
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
      <Flex as="nav" align="center" justify="center" padding="1rem">
        <ChakraLink as={NextLink} color="red.500" href="/" fontWeight="bold" fontSize="xl" mr="auto">
          HOME
        </ChakraLink>

        <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="lg" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />
        <Flex align="center" display={{ base: "none", md: "flex" }} gap={4}>
          {!isLoggedIn && (
            <>
              <ChakraLink as={Button} onClick={() => handleOpenModal("signup")}>
                Sign Up
              </ChakraLink>
              <ChakraLink as={Button} onClick={() => handleOpenModal("signin")}>
                Sign in
              </ChakraLink>
            </>
          )}
          {isLoggedIn && isSpecificPage && (
            <>
              <Upload isOpen={isUploadOpen} cloeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
              <ChakraLink as={Button} onClick={() => openUpload()}>
                Upload
              </ChakraLink>
            </>
          )}
          {isLoggedIn && (
            <>
              {/* <IconButton icon={<ArrowForwardIcon />} onClick={() => handleOpenModal("logout")} variant="outline" /> */}
              <ChakraLink as={Button} onClick={() => handleOpenModal("logout")}>
                Logout
              </ChakraLink>
              <ChakraLink as={NextLink} href="/home" mr="4" _hover={{ textDecoration: "none", color: "blue.500" }}>
                Gallary
              </ChakraLink>
              <ChakraLink as={NextLink} href="/userProfile" mr="4" _hover={{ textDecoration: "none", color: "blue.500" }}>
                Profile
              </ChakraLink>
              {/* <Upload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} /> */}
            </>
          )}
          <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent maxW="800px">
              <ModalHeader>{formType === "logout" ? "Logout" : formType === "signup" ? "Sign Up" : "Sign In"}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {formType === "signup" ? (
                  <SignUp isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} setFormType={setFormType} />
                ) : formType === "signin" ? (
                  <Signin isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} setFormType={setFormType} />
                ) : null}
              </ModalBody>
              {/* <ModalFooter>hi</ModalFooter> */}
            </ModalContent>
          </Modal>
          <IconButton aria-label="Toggle dark mode" icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />
        </Flex>

        <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size={{ base: "full", md: "half" }}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Navigation</DrawerHeader>
              <DrawerBody>
                <VStack spacing="24px">
                  {isLoggedIn && (
                    <>
                      <ChakraLink as={NextLink} href="/home" _hover={{ textDecoration: "none", color: "blue.500" }} onClick={onMenuClose}>
                        Gallary
                      </ChakraLink>
                      <ChakraLink as={NextLink} href="/userProfile" _hover={{ textDecoration: "none", color: "blue.500" }} onClick={onMenuClose}>
                        Profile
                      </ChakraLink>
                      {isSpecificPage && isLoggedIn && (
                        <>
                          <Upload isOpen={isUploadOpen} cloeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
                          <ChakraLink as="button" onClick={() => openUpload()}>
                            Upload
                          </ChakraLink>
                        </>
                      )}
                      <IconButton icon={<ArrowForwardIcon />} onClick={() => handleOpenModal("logout")} variant="outline" />
                    </>
                  )}

                  {!isLoggedIn && (
                    <>
                      <ChakraLink as={Button} onClick={() => handleOpenModal("signup")}>
                        Sign Up
                      </ChakraLink>
                      <ChakraLink as={Button} onClick={() => handleOpenModal("signin")}>
                        Sign in
                      </ChakraLink>
                    </>
                  )}
                  <IconButton aria-label="Toggle dark mode" icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
    </>
  );
};

export default Navbar;
