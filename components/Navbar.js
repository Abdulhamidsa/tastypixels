// Navbar.js
import { Flex, IconButton, useColorMode, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "./Signin";
import { useState } from "react";

const Navbar = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [formType, setFormType] = useState(null);

  const formComponents = {
    signup: <SignUp />,
    signin: <Signin />,
  };
  const formHeaders = {
    signup: "Sign Up",
    signin: "Sign In",
  };
  const handleOpenModal = (type) => {
    setFormType(type);
    onModalOpen();
  };
  return (
    <Flex as="nav" align="center" justify="center" padding="1rem">
      <ChakraLink as={NextLink} color="red" href="/" fontWeight="bold" fontSize="xl" mr="auto">
        My Next.js App
      </ChakraLink>
      <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="lg" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />{" "}
      <Flex align="center" display={{ base: "none", md: "flex" }} gap={4}>
        <ChakraLink as={NextLink} href="/about" mr="4" _hover={{ textDecoration: "none", color: "blue.500" }}>
          About
        </ChakraLink>
        <ChakraLink as={Button} onClick={() => handleOpenModal("signup")}>
          Sign Up
        </ChakraLink>
        <ChakraLink as={Button} onClick={() => handleOpenModal("signin")}>
          Sign in
        </ChakraLink>

        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>{formHeaders[formType]}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{formComponents[formType]}</ModalBody>
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
import React from "react";
