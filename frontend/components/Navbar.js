import React, { useState } from "react";
import { Flex, IconButton, Box, Button, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, Modal, ModalContent, ModalBody, Tab, Tabs, TabList, TabPanels, TabPanel, CloseButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FiLogOut } from "react-icons/fi";
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
      <Flex zIndex="1" height="fit-content" position="relative" bg="background" as="nav" align="center" p={2} justify="space-between" backdropFilter="blur(5px)" boxShadow="lg">
        <Box ml={4}>
          <NextLink href="/" passHref>
            <Image src="/logo.png" alt="logo" width={80} height={80} priority layout="fixed" />
          </NextLink>
        </Box>

        {/* Desktop & Mobile Buttons */}
        <Flex align="center" gap={4} mr={4}>
          {!isAuthenticated ? (
            <Button bg="transparent" border="1px" borderColor="primary.700" colorScheme="primary" size="md" onClick={onModalOpen} display={{ base: "none", md: "block" }}>
              Sign Up
            </Button>
          ) : (
            <>
              <Button as={NextLink} href="/home" bg="transparent" border="1px" borderColor="primary.700" colorScheme="primary" size="md">
                Food Gallery
              </Button>
              <Button as={NextLink} href={`/profile/${userName}`} bg="transparent" border="1px" borderColor="primary.700" colorScheme="primary" size="md">
                Profile
              </Button>
              <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="outline" color="red.500" />
            </>
          )}

          {/* Mobile Menu Button */}
          <IconButton aria-label="Open menu" icon={<HamburgerIcon />} size="md" color="white" variant="outline" onClick={onMenuOpen} display={{ base: "block", md: "none" }} />
        </Flex>

        {/* Mobile Drawer */}
        <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size={{ base: "full", md: "sm" }}>
          <DrawerOverlay />
          <DrawerContent bg="background.dark" color="white">
            <DrawerCloseButton />
            <DrawerHeader></DrawerHeader>
            <DrawerBody>
              <VStack spacing="20px">
                {isAuthenticated ? (
                  <>
                    <Button as={NextLink} href="/home" bg="transparent" border="1px" borderColor="primary.700" colorScheme="primary" size="md" onClick={onMenuClose}>
                      Food Gallery
                    </Button>
                    <Button as={NextLink} href={`/profile/${userName}`} bg="transparent" border="1px" borderColor="primary.700" colorScheme="primary" size="md" onClick={onMenuClose}>
                      Profile
                    </Button>
                    <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="outline" color="red.500" />
                  </>
                ) : (
                  <Button
                    bg="transparent"
                    border="1px"
                    borderColor="primary.700"
                    colorScheme="primary"
                    size="md"
                    onClick={() => {
                      onModalOpen();
                      onMenuClose();
                    }}
                  >
                    Sign Up
                  </Button>
                )}
                {isSpecificPage && isAuthenticated && (
                  <>
                    <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
                    <Button
                      bg="transparent"
                      border="1px"
                      borderColor="primary.700"
                      colorScheme="primary"
                      size="md"
                      onClick={() => {
                        setIsUploadOpen(true);
                        onMenuClose();
                      }}
                    >
                      Upload
                    </Button>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>

      {/* Auth Modal with Tabs */}
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalContent maxH="auto" maxW={["90vw", "70vw", "50vw", "40vw"]} borderRadius="lg" boxShadow="xl" bg="Background" p="6">
          <CloseButton size="xl" onClick={onModalClose} position="absolute" right="0px" top="0px" />
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
