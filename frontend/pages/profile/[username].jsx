import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Avatar,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Badge,
  useDisclosure,
  Collapse,
  Skeleton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  FormControl,
  FormLabel,
  Input,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaUser, FaList, FaTrash, FaComment, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import CardSkeleton from '@/components/CardSkeleton';
import CommentsSection from '@/components/CommentsSection';
import Upload from '@/components/Upload';
import useComments from '@/hooks/useComments';
import { useFetch } from '@/hooks/useFetchUser';
import Image from 'next/legacy/image';
import { fetchWithTokenRefresh } from '@/utils/auth';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { getApiUrl } from '@/utils/api';

export default function Dashboard() {
  const { user, loading, uploadList, deleteUpload } = useFetch();
  const { comments, loadingComments, deletingCommentId, fetchComments, handleAddComment, handleDeleteComment } =
    useComments();
  const toast = useToast();
  const { state } = useAuth();
  const { isAuthenticated, isLoading } = state;
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [showCommentSection, setShowCommentSection] = useState({});
  const [loadingCommentSection, setLoadingCommentSection] = useState({});
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState(null);
  const [loadingUserUpdate, setLoadingUserUpdate] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { onClose: onMenuClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserData(user);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Loading />;
  const openUpload = () => {
    setIsUploadOpen(true);
  };
  // const handleEditUpload = (upload) => {
  //   setSelectedUploadId(upload._id);
  //   onEditOpen();
  // };

  // const handleSaveEdit = async (editedUpload) => {
  //   try {
  //     await updateUpload(user._id, editedUpload);
  //     onEditClose();
  //     toast({
  //       title: 'Upload updated.',
  //       description: 'The upload has been successfully updated.',
  //       status: 'success',
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: error.message,
  //       status: 'error',
  //       duration: 2000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleRemoveUpload = async () => {
    try {
      await deleteUpload(selectedUploadId);
      onDeleteClose();
      toast({
        title: 'Upload deleted.',
        description: 'The upload has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleComments = async (uploadId) => {
    setLoadingCommentSection((prev) => ({ ...prev, [uploadId]: true }));
    if (!showCommentSection[uploadId]) {
      await fetchComments(uploadId);
    }
    setLoadingCommentSection((prev) => ({ ...prev, [uploadId]: false }));
    setShowCommentSection((prev) => ({ ...prev, [uploadId]: !prev[uploadId] }));
  };
  const handleUserUpdate = async (e) => {
    e.preventDefault();
    setLoadingUserUpdate(true);

    const updatedUser = {
      username,
      email,
      password,
    };

    try {
      const response = await fetchWithTokenRefresh(getApiUrl('/api/edit-post'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (response.ok) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          username: data.username,
          email: data.email,
        }));

        setPassword('');
        setTimeout(() => {
          toast({
            title: 'User updated.',
            description: 'Your user information has been successfully updated.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          onClose();
          window.location.reload();
        }, 500);
      } else {
        console.error('Error updating user:', data.errors);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoadingUserUpdate(false);
    }
  };

  return (
    <Box mx="auto" pt="10" width="100%" maxW="1000px">
      <Heading as="h1" m={0} textAlign="center">
        User Dashboard
      </Heading>
      <Tabs variant="enclosed">
        <TabList mb={4}>
          <Tab>
            <FaUser />
            <Text ml={2}>User Info</Text>
          </Tab>
          <Tab>
            <FaList />
            <Text ml={2}>Posts</Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {loading ? (
              <Loading />
            ) : (
              <Stack spacing={4}>
                <Box>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit User Info</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Box as="form" onSubmit={handleUserUpdate}>
                          <FormControl id="username" mb={4}>
                            <FormLabel>Username</FormLabel>
                            <Input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </FormControl>
                          <FormControl id="email" mb={4}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                          </FormControl>
                          <FormControl id="password" mb={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                          </FormControl>
                          <Button type="submit" colorScheme="blue" isLoading={loadingUserUpdate}>
                            Save Changes
                          </Button>
                        </Box>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Box>

                {userData && (
                  <Flex align="center">
                    <Avatar size="xl" name={userData.username} src={userData.userAvatar} />
                    <Box ml={4}>
                      <Heading as="h2" size="lg">
                        {userData.username}
                      </Heading>
                      <Text>Email: {userData.email}</Text>
                      <Text>Username: {userData.username}</Text>
                    </Box>
                  </Flex>
                )}
                <Button width="150px" onClick={onOpen} colorScheme="blue">
                  Edit User Info
                </Button>
              </Stack>
            )}
          </TabPanel>
          <TabPanel>
            {loading ? (
              <Box w="420px">
                <CardSkeleton />
              </Box>
            ) : uploadList && uploadList.length > 0 ? (
              uploadList.map((upload) => (
                <Box
                  key={upload._id}
                  position="relative"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  width="100%"
                  maxW="450px"
                  mx="auto"
                  my="4"
                  boxShadow="lg"
                  bg="gray.800"
                  transition="all 0.3s"
                  _hover={{ boxShadow: 'xl' }}
                >
                  {/* User Info */}
                  <Box bg="gray.900" p="4" display="flex" alignItems="center">
                    <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="3" />
                    <Box color="white">
                      <Heading fontSize="md" fontWeight="bold">
                        {upload.username}
                      </Heading>
                      <Text pt="1" fontSize="xs" color="gray.400">
                        {new Date(upload.postedAt).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Flex ml="auto" gap={2}>
                      {/* Edit Button (Commented Out) */}
                      {/* 
        <IconButton
          aria-label="Edit upload"
          icon={<FaEdit />}
          onClick={() => handleEditUpload(upload)}
          colorScheme="blue"
          bg="gray.700"
          borderRadius="full"
          _hover={{ bg: "blue.500" }}
        />
        */}
                      <IconButton
                        aria-label="Delete upload"
                        icon={<FaTrash />}
                        onClick={() => {
                          setSelectedUploadId(upload._id);
                          onDeleteOpen();
                        }}
                        colorScheme="red"
                        bg="gray.700"
                        borderRadius="full"
                        _hover={{ bg: 'red.500' }}
                      />
                    </Flex>
                  </Box>

                  {/* Upload Details */}
                  <Box p={4} bg="white" color="black">
                    <Heading fontSize="lg" fontWeight="semibold">
                      {upload.title}
                    </Heading>
                    <Text fontSize="md" mt={1} color="gray.700">
                      {upload.description}
                    </Text>

                    {/* Tags */}
                    <Flex flexWrap="wrap" gap={1} mt={2}>
                      {upload.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} colorScheme="orange" fontSize="xs" px={2} py={1}>
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>

                  {/* Image Section */}
                  <Box position="relative" overflow="hidden" w="100%" height="250px">
                    <Image
                      alt={upload.title}
                      src={upload.imageUrl}
                      layout="fill"
                      objectFit="cover"
                      style={{ borderRadius: '8px' }}
                    />
                  </Box>

                  {/* Category Badge */}
                  <Badge textAlign="center" p="3" colorScheme="purple" fontSize="sm">
                    {upload.category}
                  </Badge>

                  {/* Action Buttons */}
                  <Flex p={4} gap={3} align="center">
                    {/* Like Button (Disabled) */}
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button colorScheme="gray" variant="outline" cursor="default" isDisabled>
                        <FaArrowUp />
                      </Button>
                      <Text fontSize="sm">{upload.likes}</Text>
                    </Box>

                    {/* Dislike Button (Disabled) */}
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button colorScheme="gray" variant="outline" cursor="default" isDisabled>
                        <FaArrowDown />
                      </Button>
                      <Text fontSize="sm">{upload.dislikes}</Text>
                    </Box>

                    {/* Comments */}
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button
                        aria-label="Comments"
                        onClick={() => toggleComments(upload._id)}
                        colorScheme={showCommentSection[upload._id] ? 'teal' : 'gray'}
                        variant="outline"
                        isDisabled
                        isLoading={loadingCommentSection[upload._id]}
                      >
                        <FaComment />
                      </Button>
                      <Text fontSize="sm">{comments[upload._id]?.length ?? upload.comments.length}</Text>
                    </Box>

                    {/* Report Button */}
                    {/* <Button ml="auto" aria-label="Report" colorScheme="yellow" variant="outline">
                      <FaFlag />
                    </Button> */}
                  </Flex>

                  {/* Comments Section */}
                  <Collapse in={showCommentSection[upload._id]} animateOpacity>
                    {loadingComments[upload._id] ? (
                      <Box w="100%">
                        {[...Array(comments[upload._id]?.length || 3)].map((_, index) => (
                          <Box key={index} p={2} borderWidth="1px" w="100%">
                            <Flex alignItems="center" mb={1}>
                              <Skeleton height="30px" width="30px" borderRadius="50%" />
                              <Skeleton ml={2} height="15px" width="80px" />
                            </Flex>
                            <Skeleton height="30px" width="100%" />
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <CommentsSection
                        uploadId={upload._id}
                        userId={user.id}
                        comments={comments[upload._id] || []}
                        fetchComments={fetchComments}
                        handleDeleteComment={handleDeleteComment}
                        handleAddComment={handleAddComment}
                        showComments={showCommentSection[upload._id]}
                        loadingComments={loadingComments[upload._id]}
                        deletingCommentId={deletingCommentId}
                      />
                    )}
                  </Collapse>

                  {/* Delete Confirmation */}
                  <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Delete Upload
                        </AlertDialogHeader>
                        <AlertDialogBody>Are you sure? This action cannot be undone.</AlertDialogBody>
                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onDeleteClose}>
                            Cancel
                          </Button>
                          <Button colorScheme="red" onClick={handleRemoveUpload} ml={3}>
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              ))
            ) : (
              <>
                <Text>Hey {username}, You have not posted anything yet, ready for your first post?</Text>
                <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
                <ChakraLink color="blue.400" onClick={() => openUpload()}>
                  Upload Now
                </ChakraLink>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
