'use client';
import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Box,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Modal,
  ModalContent,
  ModalBody,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  CloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiLogOut, FiUpload } from 'react-icons/fi';
import SignUp from '@/components/Signup';
import Signin from '@/components/Signin';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import Upload from '@/components/Upload';
import NextLink from 'next/link';

const Navbar = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, userName } = state;
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  const isSpecificPage = router.pathname === '/home';
  const isHomePage = router.pathname === '/home';
  const isProfilePage = router.pathname.includes('/profile');

  const handleLogout = () => {
    logout();
    onMenuClose();
    router.push('/');
  };

  return (
    <>
      <Flex
        zIndex="10"
        height="fit-content"
        position="fixed"
        top="0"
        width="100%"
        bg="background"
        as="nav"
        align="center"
        p={1}
        justify="space-between"
        backdropFilter="blur(5px)"
        boxShadow="lg"
      >
        {/* Logo */}
        <Box ml={4}>
          <NextLink href="/" passHref>
            <Image src="/logo.png" alt="logo" width={80} height={80} priority layout="fixed" />
          </NextLink>
        </Box>

        {/* Desktop Nav Links */}
        <Flex align="center" gap={4} mr={4} display={{ base: 'none', md: 'flex' }}>
          {!isAuthenticated ? (
            <>
              <Button
                as={NextLink}
                href="/home"
                bg="transparent"
                border="2px solid"
                borderColor={isHomePage ? 'primary.500' : 'transparent'}
                color={isHomePage ? 'primary.500' : 'gray.700'}
                _hover={{ borderColor: 'primary.400' }}
                size="md"
              >
                Browse Meals
              </Button>
              <Button bg="transparent" borderColor="primary.700" colorScheme="primary" size="md" onClick={onModalOpen}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Button
                color="white"
                variant="ghost"
                size="md"
                leftIcon={<FiUpload />}
                _hover={{ borderColor: 'primary.400' }}
                border="1px solid"
                borderColor="transparent"
                onClick={() => setIsUploadOpen(true)}
              >
                Upload
              </Button>
              <Button
                as={NextLink}
                href="/home"
                bg="transparent"
                border="2px solid"
                borderColor={isHomePage ? 'primary.500' : 'transparent'}
                color={isHomePage ? 'primary.500' : 'gray.400'}
                _hover={{ borderColor: 'primary.400' }}
                size="md"
              >
                Food Gallery
              </Button>
              <Button
                as={NextLink}
                href={`/profile/${userName}`}
                bg="transparent"
                border="2px solid"
                borderColor={isProfilePage ? 'primary.500' : 'transparent'}
                color={isProfilePage ? 'primary.500' : 'gray.400'}
                _hover={{ borderColor: 'primary.400' }}
                size="md"
              >
                Profile
              </Button>
              <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="link" />
            </>
          )}
        </Flex>

        <Flex align="center" gap="8" mr={4} display={{ base: 'flex', md: 'none' }}>
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
                color="white"
                p={2}
                transition="all 0.3s ease"
                _hover={{ borderColor: 'primary.400' }}
                _active={{
                  border: '1px solid',
                  borderColor: 'primary.700',
                  transform: 'scale(0.95)',
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
          {!isAuthenticated && (
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              size="md"
              color="white"
              variant="solid"
              onClick={onMenuOpen}
              display={{ base: 'block', md: 'none' }}
            />
          )}
          {isAuthenticated && (
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              size="md"
              color="white"
              variant="solid"
              onClick={onMenuOpen}
              display={{ base: 'block', md: 'none' }}
            />
          )}
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
                    <Button
                      as={NextLink}
                      href="/home"
                      bg="transparent"
                      border="2px solid"
                      borderColor={isHomePage ? 'primary.500' : 'transparent'}
                      color={isHomePage ? 'primary.500' : 'white'}
                      _hover={{ borderColor: 'primary.400' }}
                      width={['50%', '180px', '200px']}
                      onClick={onMenuClose}
                    >
                      Food Gallery
                    </Button>

                    <Button
                      color="white"
                      width={['50%', '180px', '200px']}
                      leftIcon={<FiUpload />}
                      onClick={() => {
                        setIsUploadOpen(true);
                        onMenuClose();
                      }}
                    >
                      Upload
                    </Button>

                    <Button
                      as={NextLink}
                      href={`/profile/${userName}`}
                      bg="transparent"
                      border="2px solid"
                      borderColor={isProfilePage ? 'primary.500' : 'transparent'}
                      color={isProfilePage ? 'primary.500' : 'white'}
                      _hover={{ borderColor: 'primary.400' }}
                      width={['50%', '180px', '200px']}
                      onClick={onMenuClose}
                    >
                      Profile
                    </Button>
                    <IconButton aria-label="Logout" icon={<FiLogOut />} onClick={handleLogout} variant="link" />
                  </>
                ) : (
                  <>
                    <Button
                      as={NextLink}
                      href="/home"
                      bg="transparent"
                      border="2px solid"
                      borderColor={isHomePage ? 'primary.500' : 'transparent'}
                      color={isHomePage ? 'primary.500' : 'white'}
                      _hover={{ borderColor: 'primary.400' }}
                      width={['50%', '180px', '200px']}
                      onClick={onMenuClose}
                    >
                      Browse Meals
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        onModalOpen();
                        onMenuClose();
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>

      {/* Auth Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalContent maxW={['90vw', '70vw', '50vw', '40vw']} borderRadius="lg" boxShadow="xl" bg="Background" p="6">
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

      {/* Upload Modal */}
      {isAuthenticated && <Upload isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />}
    </>
  );
};

export default Navbar;
