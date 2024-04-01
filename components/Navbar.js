import React from "react";
import { Flex, IconButton, useColorMode, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, ArrowForwardIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "./Signin";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import Loading from "@/components/Loading";
import router from "next/router";

const Navbar = () => {
  const { isLoggedIn, logouts, isLoading } = useAuth();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [formType, setFormType] = useState(null);

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
      } catch (error) {
        // Handle the error here
      }
    } else {
      setFormType(type);
      onModalOpen();
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Flex as="nav" align="center" justify="center" padding="1rem">
      <ChakraLink as={NextLink} color="red" href="/" fontWeight="bold" fontSize="xl" mr="auto">
        My Next.js App
      </ChakraLink>
      <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="lg" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />
      <Flex align="center" display={{ base: "none", md: "flex" }} gap={4}>
        <ChakraLink as={NextLink} href="/about" mr="4" _hover={{ textDecoration: "none", color: "blue.500" }}>
          About
        </ChakraLink>
        {/* Conditionally render Sign Up and Sign In buttons */}
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
        {isLoggedIn && <IconButton icon={<ArrowForwardIcon />} onClick={() => handleOpenModal("logout")} variant="outline" />}{" "}
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>{formType === "logout" ? "Logout" : formType === "signup" ? "Sign Up" : "Sign In"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{formType === "signup" ? <SignUp /> : formType === "signin" ? <Signin /> : null}</ModalBody>
            <ModalFooter>hi</ModalFooter>
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
                <ChakraLink as={NextLink} href="/about" onClick={onMenuClose}>
                  About
                </ChakraLink>
                <ChakraLink as={NextLink} href="/contact" onClick={onMenuClose}>
                  Contact
                </ChakraLink>
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
  );
};

export default Navbar;
