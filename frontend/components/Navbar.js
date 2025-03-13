import React, { useState } from "react";
import { Flex, IconButton, Box, Button, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, Modal, ModalContent, ModalBody, Tab, Tabs, TabList, TabPanels, TabPanel, CloseButton, background } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiLogOut, FiUpload } from "react-icons/fi";
import SignUp from "@/components/Signup";
import Signin from "@/components/Signin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Upload from "@/components/Upload";
import NextLink from "next/link";

const Navbar = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, userName } = state;
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  const isSpecificPage = router.pathname === "/home";

  const handleLogout = () => {
    logout();
    onMenuClose();
    router.push("/");
  };

  return (
    <>
      <Flex zIndex="10" height="fit-content" position="relative" bg="background" as="nav" align="center" p={2} justify="space-between" backdropFilter="blur(5px)" boxShadow="lg">
        {/* Logo */}
        <Box ml={4}>
          <NextLink href="/" passHref>
            <Image src="/logo.png" alt="logo" width={80} height={80} priority layout="fixed" />
          </NextLink>
        </Box>

        {/* Desktop Nav Links */}
        <Flex align="center" gap={4} mr={4} display={{ base: "none", md: "flex" }}>
          {!isAuthenticated ? (
            <Button bg="transparent" borderColor="primary.700" colorScheme="primary" size="md" onClick={onModalOpen}>
              Sign Up
            </Button>
          ) : (
            <>
              <Button as={NextLink} href="/home" bg="transparent" borderColor="primary.700" colorScheme="primary" size="md">
                Food Gallery
              </Button>
              <Button as={NextLink} href={`/profile/${userName}`} bg="transparent" borderColor="primary.700" colorScheme="primary" size="md">
                Profile
              </Button>
              <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="outline" />
            </>
          )}
        </Flex>

        <Flex align="center" gap="8" mr={4} display={{ base: "flex", md: "none" }}>
          {isSpecificPage && isAuthenticated && (
            <>
              <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
              <IconButton
                size="md"
                aria-label="Open menu"
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                bg="primary.500"
                color="white"
                p={2}
                transition="all 0.3s ease"
                _hover={{
                  bg: "primary.600",
                }}
                _active={{
                  bg: "primary.700",
                  transform: "scale(0.95)",
                }}
                onClick={() => {
                  setIsUploadOpen(true);
                  onMenuClose();
                }}
              >
                <FiUpload />
              </IconButton>
            </>
          )}
          {!isAuthenticated && <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="md" color="white" variant="solid" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />}
          {isAuthenticated && <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="md" color="white" variant="solid" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />}
        </Flex>

        {/* Mobile Drawer */}

        <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size="sm">
          <DrawerOverlay />
          <DrawerContent bg="background.dark" color="white">
            <DrawerCloseButton />
            <DrawerHeader></DrawerHeader>
            <DrawerBody>
              <VStack spacing="20px">
                {isAuthenticated ? (
                  <>
                    <Button as={NextLink} href="/home" variant="default" width={["50%", "180px", "200px"]} onClick={onMenuClose}>
                      Food Gallery
                    </Button>

                    <Button as={NextLink} href={`/profile/${userName}`} variant="default" width={["50%", "180px", "200px"]} onClick={onMenuClose}>
                      Profile
                    </Button>
                    <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="default" />
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => {
                      onModalOpen();
                      onMenuClose();
                    }}
                  >
                    Sign Up
                  </Button>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>

      {/* Auth Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalContent maxW={["90vw", "70vw", "50vw", "40vw"]} borderRadius="lg" boxShadow="xl" bg="Background" p="6">
          <CloseButton size="lg" onClick={onModalClose} position="absolute" right="10px" top="10px" />
          <ModalBody p={0}>
            <Tabs mt="6" variant="soft-rounded" colorScheme="whiteAlpha" isFitted>
              <TabList>
                <Tab>Sign Up</Tab>
                <Tab>Sign In</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SignUp isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} />
                </TabPanel>
                <TabPanel>
                  <Signin isModalOpen={isModalOpen} onModalOpen={onModalOpen} onModalClose={onModalClose} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
