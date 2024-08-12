import React, { useCallback, useState } from "react";
import { Flex, IconButton, Box, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, Spinner } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi"; // Import the logout icon
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import SignUp from "@/components/Signup";
import NextLink from "next/link";
import Signin from "@/components/Signin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Upload from "@/components/Upload";
import Link from "next/link";

const Navbar = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, loading, userName } = state;
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
      onMenuClose();
    } else {
      setFormType(type);
      onModalOpen();
      handleMenuClose();
    }
  };

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <>
      <Flex zIndex="1" position="relative" bg="rgba(0, 0, 0, 0.5)" as="nav" align="center" p={1} justify="flex-end" backdropFilter="blur(5px)">
        <Box mr="auto">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={85} height={85} priority layout="fixed" />
          </Link>
        </Box>
        <IconButton mr={5} aria-label="Open menu" icon={<HamburgerIcon />} size="md" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />

        <Flex align="center" display={{ base: "none", md: "flex" }} pr={3} gap={10}>
          <Link as={NextLink} href="/home">
            Food Gallery
          </Link>
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
          {isSpecificPage && isAuthenticated && (
            <>
              <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
              <ChakraLink onClick={() => openUpload()}>Upload</ChakraLink>
            </>
          )}

          {isAuthenticated && (
            <>
              <ChakraLink as={NextLink} href={`/profile/${userName}`} onClick={onMenuClose}>
                Profile
              </ChakraLink>
              <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={() => handleOpenModal("logout")} variant="outline" colorScheme="red" border="1px" />
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
                  <ChakraLink as={NextLink} href="/home" onClick={onMenuClose}>
                    Food Gallery
                  </ChakraLink>
                  {isAuthenticated && (
                    <>
                      <ChakraLink as={NextLink} href={`/profile/${userName}`} onClick={onMenuClose}>
                        Profile
                      </ChakraLink>
                      <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={() => handleOpenModal("logout")} variant="outline" colorScheme="" />
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <Link href="/signup" passHref>
                        <ChakraLink
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenModal("signup");
                          }}
                        >
                          Sign Up
                        </ChakraLink>
                      </Link>

                      <Link href="/signin" passHref>
                        <ChakraLink
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenModal("signin");
                          }}
                        >
                          Sign In
                        </ChakraLink>
                      </Link>
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
