import React, { useRef, useState, useEffect } from "react";
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
  Spinner,
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
} from "@chakra-ui/react";
import { FaUser, FaList, FaEdit, FaTrash, FaComment, FaFlag, FaArrowUp, FaArrowDown } from "react-icons/fa";
import CardSkeleton from "@/components/CardSkeleton";
import CommentsSection from "@/components/CommentsSection";
import Upload from "@/components/Upload";
import useComments from "@/hooks/useComments";
import { useFetch } from "@/hooks/useFetchUser";
import Image from "next/legacy/image";
import { fetchWithTokenRefresh } from "@/utils/auth";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { user, loading, uploadList, updateUpload, deleteUpload } = useFetch();
  const { comments, loadingComments, deletingCommentId, fetchComments, handleAddComment, handleDeleteComment } = useComments();
  const toast = useToast();
  const { state } = useAuth();
  const { isAuthenticated, isLoading } = state;
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [showCommentSection, setShowCommentSection] = useState({});
  const [loadingCommentSection, setLoadingCommentSection] = useState({});
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userData, setUserData] = useState(null);
  const [loadingUserUpdate, setLoadingUserUpdate] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/");
  }
  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }
  const openUpload = () => {
    setIsUploadOpen(true);
  };
  const handleEditUpload = (upload) => {
    setSelectedUploadId(upload._id);
    onEditOpen();
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveEdit = async (editedUpload) => {
    try {
      await updateUpload(user._id, editedUpload);
      onEditClose();
      toast({
        title: "Upload updated.",
        description: "The upload has been successfully updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRemoveUpload = async () => {
    try {
      await deleteUpload(selectedUploadId);
      onDeleteClose();
      toast({
        title: "Upload deleted.",
        description: "The upload has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
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
      const response = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/api/edit-post", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

        setPassword("");
        setTimeout(() => {
          toast({
            title: "User updated.",
            description: "Your user information has been successfully updated.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          onClose();
          window.location.reload();
        }, 500);
      } else {
        console.error("Error updating user:", data.errors);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoadingUserUpdate(false);
    }
  };

  return (
    <Box mx="auto" pt="6" width="100%" maxW="800px">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        User Dashboard
      </Heading>

      <Tabs variant="enclosed">
        <TabList>
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
          {/* User Info Section */}
          <TabPanel>
            {loading ? (
              <Loading />
            ) : (
              <Stack spacing={5}>
                <Flex align="center">
                  <Avatar size="xl" name={userData?.username} src={userData?.userAvatar} />
                  <Box ml={4}>
                    <Heading as="h2" size="md">
                      {userData?.username}
                    </Heading>
                    <Text fontSize="sm" color="gray.400">
                      {userData?.email}
                    </Text>
                  </Box>
                </Flex>
                <Button width="150px" onClick={onOpen} colorScheme="blue">
                  Edit Profile
                </Button>
              </Stack>
            )}
          </TabPanel>

          {/* Posts Section */}
          <TabPanel>
            {loading ? (
              <Box w="420px">
                <CardSkeleton />
              </Box>
            ) : uploadList && uploadList.length > 0 ? (
              uploadList.map((upload) => (
                <Box key={upload._id} bg="gray.900" borderRadius="lg" p={4} mb={6} boxShadow="md">
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Avatar size="sm" name={upload.username} src={upload.userAvatar} />
                      <Box ml={3}>
                        <Text fontWeight="bold">{upload.username}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(upload.postedAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    </Flex>

                    <Flex gap={2}>
                      <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditUpload(upload)} colorScheme="blue" size="sm" />
                      <IconButton
                        aria-label="Delete"
                        icon={<FaTrash />}
                        onClick={() => {
                          setSelectedUploadId(upload._id);
                          onDeleteOpen();
                        }}
                        colorScheme="red"
                        size="sm"
                      />
                    </Flex>
                  </Flex>

                  <Box mt={3}>
                    <Heading fontSize="lg">{upload.title}</Heading>
                    <Text fontSize="sm" color="gray.300" mb={2}>
                      {upload.description}
                    </Text>
                    <Flex gap={2} wrap="wrap">
                      {upload.tags.map((tag, index) => (
                        <Badge key={index} colorScheme="purple">
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>

                  <Box mt={4} position="relative">
                    <Image alt={upload.imageUrl} src={upload.imageUrl} width={500} height={300} objectFit="cover" style={{ borderRadius: "8px" }} />
                  </Box>

                  <Flex align="center" justify="space-between" mt={4}>
                    <Flex gap={2}>
                      <IconButton aria-label="Upvote" icon={<FaArrowUp />} size="sm" variant="outline" isDisabled colorScheme="gray" />
                      <Text>{upload.likes}</Text>

                      <IconButton aria-label="Downvote" icon={<FaArrowDown />} size="sm" variant="outline" isDisabled colorScheme="gray" />
                      <Text>{upload.dislikes}</Text>
                    </Flex>

                    <Flex gap={2}>
                      <Button aria-label="Comments" onClick={() => toggleComments(upload._id)} colorScheme={showCommentSection[upload._id] ? "teal" : "gray"} size="sm" variant="outline" isLoading={loadingCommentSection[upload._id]} leftIcon={<FaComment />}>
                        {comments[upload._id]?.length ?? upload.comments.length}
                      </Button>

                      <Button aria-label="Report" colorScheme="yellow" size="sm" variant="outline">
                        <FaFlag />
                      </Button>
                    </Flex>
                  </Flex>

                  <Collapse in={showCommentSection[upload._id]} animateOpacity mt={3}>
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
                </Box>
              ))
            ) : (
              <Box textAlign="center" mt={6}>
                <Text color="gray.400">Hey {username}, You have not posted anything yet, ready for your first post?</Text>
                <Upload isOpen={isUploadOpen} closeMenu={onMenuClose} onClose={() => setIsUploadOpen(false)} />
                <Button mt={3} colorScheme="blue" onClick={() => openUpload()}>
                  Upload Now
                </Button>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
