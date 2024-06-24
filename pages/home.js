import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Button,
  SkeletonCircle,
  ModalHeader,
  Spinner,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  CloseButton,
  Box,
  Avatar,
  Text,
  Badge,
  Heading,
  Divider,
  IconButton,
  Flex,
  useToast,
  Skeleton,
  SkeletonText,
  Textarea,
  Collapse,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import CardsTemplate from "@/components/CardsTemplate";
import { FaArrowUp, FaArrowDown, FaComment, FaFlag, FaThumbsUp, FaThumbsDown, FaHeart, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { MdFilterList } from "react-icons/md";

export default function About() {
  const [uploads, setUploads] = useState([]);
  const { isLoggedIn, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingVote, setLoadingVote] = useState({ like: false, dislike: false });
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState({}); // Store comments by uploadId
  const [newComment, setNewComment] = useState({}); // Store new comment text by uploadId
  const [showComments, setShowComments] = useState({}); // Toggle show/hide comments by uploadId
  const toast = useToast();
  const [loadingComments, setLoadingComments] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const containerRef = useRef(null); // Ref for the comments container

  const [userData, setUserData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterOptions, setFilterOptions] = useState({
    showLikes: false,
    showDislikes: false,
    showComments: false,
  });

  useEffect(() => {
    const fetchUserAndUploads = async () => {
      try {
        const userResponse = await fetch("/api/getUserUploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUserData(userData);
        const { likedPosts, dislikedPosts, uploads: userUploads } = userData.user;
        const recipesResponse = await fetch("/api/api-fetch-recipe");
        if (!recipesResponse.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const recipesData = await recipesResponse.json();

        const initializedUploads = recipesData.map((upload) => ({
          ...upload,
          isLiked: likedPosts.some((post) => post.uploadId === upload._id),
          isDisliked: dislikedPosts.some((post) => post.uploadId === upload._id),
        }));

        setUploads(initializedUploads);
      } catch (error) {
        console.error("Error fetching user data or recipes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data or recipes",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserAndUploads();
    }
  }, [isLoggedIn, userId, toast]);

  const handleVote = async (uploadId, action) => {
    setLoadingVote((prev) => ({ ...prev, [action]: true }));
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const responsePromise = fetch("/api/api-update-likes-dislikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId, action }),
      });
      const [response] = await Promise.all([responsePromise, timeoutPromise]);
      if (!response.ok) {
        throw new Error("Failed to update likes/dislikes");
      }
      const data = await response.json();
      const updatedUploads = uploads.map((upload) =>
        upload._id === uploadId
          ? {
              ...upload,
              isLiked: action === "like" ? !upload.isLiked : false,
              isDisliked: action === "dislike" ? !upload.isDisliked : false,
              likes: data.upload.likes,
              dislikes: data.upload.dislikes,
            }
          : upload
      );

      setUploads(updatedUploads);
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
    } finally {
      setLoadingVote((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleClose = () => setSelectedImage(null);

  const handleCommentChange = (e, uploadId) => {
    setNewComment((prevNewComment) => ({
      ...prevNewComment,
      [uploadId]: e.target.value,
    }));
  };

  const handleToggleComments = async (uploadId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [uploadId]: !prevShowComments[uploadId],
    }));

    if (!showComments[uploadId]) {
      try {
        setLoadingComments((prevLoadingComments) => ({
          ...prevLoadingComments,
          [uploadId]: true,
        }));

        const response = await fetch(`/api/api-fetch-comments?uploadId=${uploadId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const fetchedComments = await response.json();
        setComments((prevComments) => ({
          ...prevComments,
          [uploadId]: fetchedComments,
        }));
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments((prevLoadingComments) => ({
          ...prevLoadingComments,
          [uploadId]: false,
        }));
      }
    }
  };

  const fetchComments = async (uploadId) => {
    setLoadingComments((prevLoadingComments) => ({
      ...prevLoadingComments,
      [uploadId]: true,
    }));

    try {
      const response = await fetch(`/api/api-fetch-comments?uploadId=${uploadId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const comments = await response.json();
      const commentsLength = comments.length; // Get the length of comments array
      console.log(commentsLength);
      setComments((prevComments) => ({
        ...prevComments,
        [uploadId]: comments,
      }));
      return commentsLength; // Return the length of comments array
    } catch (error) {
      console.error("Error fetching comments:", error);
      return 0; // Return 0 or handle error as per your requirement
    } finally {
      setLoadingComments((prevLoadingComments) => ({
        ...prevLoadingComments,
        [uploadId]: false,
      }));
    }
  };

  const handleAddComment = async (uploadId) => {
    const commentText = newComment[uploadId]?.trim();
    if (!commentText) return;

    try {
      const response = await fetch("/api/api-add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId, text: commentText, username: userData.user.username }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      await fetchComments(uploadId); // Fetch comments after adding

      setNewComment((prevNewComment) => ({
        ...prevNewComment,
        [uploadId]: "",
      }));

      toast({
        title: "Comment added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteComment = async (uploadId, commentId) => {
    try {
      const commentToDelete = comments[uploadId]?.find((comment) => comment._id === commentId);
      if (!commentToDelete) {
        console.error("Comment not found");
        return;
      }

      if (commentToDelete.userId !== userId) {
        console.error("You can only delete your own comments");
        return;
      }

      setDeletingCommentId(commentId);

      const response = await fetch("/api/api-delete-comment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          commentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Update comments state after successful deletion
      await fetchComments(uploadId);

      toast({
        title: "Comment deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeletingCommentId(null);
    }
  };
  const handleReport = async (uploadId) => {
    try {
      const response = await fetch("/api/api-report-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId }), // Ensure userId and uploadId are correctly defined
      });

      if (!response.ok) {
        throw new Error("Failed to report upload");
      }

      // Handle success
      toast({
        title: "Upload Reported",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Optionally, trigger state update or UI changes
    } catch (error) {
      console.error("Error reporting upload:", error);
      toast({
        title: "Error",
        description: "Failed to report upload. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.900">
                    <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                      <SkeletonCircle size="10" />
                      <Box color="black" ml="4">
                        <SkeletonText mt="2" noOfLines={1} width="100px" />
                        <SkeletonText mt="2" noOfLines={1} width="150px" />
                      </Box>
                    </Box>

                    <Box p={3} mb="5" bg="white" color="black">
                      <SkeletonText mt="2" mb="8" noOfLines={1} width="200px" />
                      <SkeletonText mt="2" noOfLines={2} spacing="4" />
                      <Skeleton mt="4" height="300px" />
                    </Box>

                    <Flex direction="row" justify="flex-start" p={4} gap={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="9" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="9" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="9" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                      <Box ml="auto" display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="9" />
                      </Box>
                    </Flex>
                  </Box>
                ))
              : uploads.map((upload) => (
                  <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
                    <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                      <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="3" />
                      <Box color="black">
                        <Heading fontSize="lg" fontWeight="bold">
                          {upload.username}
                        </Heading>
                        <Text fontSize="sm">Last seen: {upload.lastSeen} 06/19/2024 </Text>
                      </Box>
                    </Box>

                    <Box p={3} bg="white" color="black">
                      <Heading fontSize="xl" mb={3}>
                        {upload.title}
                      </Heading>
                      <Text fontSize="md">{upload.description}</Text>
                      <Box position="relative" display="flex" gap={1}>
                        {upload.tags.map((tag, index) => (
                          <Text fontSize="sm" color="gray.600" pb="2" key={`${tag}-${index}`}>
                            {tag}
                          </Text>
                        ))}
                      </Box>
                    </Box>

                    <Box position="relative" overflow="hidden">
                      <Image src={upload.imageUrl} alt={upload.title} width={400} height={300} />
                      <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100%" colorScheme="orange" />
                    </Box>
                    <Badge width="100px" textAlign="center" position="" bottom="0" borderRadius="0" p="3" colorScheme="orange">
                      {upload.category}
                    </Badge>
                    <Flex p={4} gap={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Upvote" onClick={() => handleVote(upload._id, "like")} colorScheme={upload.isLiked ? "green" : "gray"} variant="outline">
                          {loadingVote.like ? <Spinner size="sm" /> : <FaArrowUp />}
                        </Button>
                        <Text mx={2}>{upload.likes}</Text>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Downvote" onClick={() => handleVote(upload._id, "dislike")} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline">
                          {loadingVote.dislike ? <Spinner size="sm" /> : <FaArrowDown />}
                        </Button>
                        <Text mx={2}>{upload.dislikes}</Text>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Comments" onClick={() => handleToggleComments(upload._id)} colorScheme={showComments[upload._id] ? "teal" : "gray"} variant="outline">
                          <FaComment />
                        </Button>
                        <Text>{comments[upload._id]?.length ?? upload.comments.length}</Text>
                      </Box>
                      <Box ml="auto" display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Report" onClick={() => handleReport(upload._id)} colorScheme="yellow" variant="outline">
                          <FaFlag /> Report
                        </Button>
                      </Box>
                    </Flex>
                    <Collapse in={showComments[upload._id]} animateOpacity>
                      {comments[upload._id]?.map((comment) => (
                        <Box key={comment._id} p={2} borderWidth="1px" w="100%">
                          <Flex alignItems="center" mb={1}>
                            <Avatar size="xs" name={comment.username} />
                            <Text ml={2} fontWeight="bold">
                              {comment.username}
                            </Text>
                          </Flex>
                          <Flex justifyContent="space-between">
                            <Text>{comment.text}</Text>
                            {deletingCommentId === comment._id ? <Spinner size="sm" /> : comment.userId === userId && <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => handleDeleteComment(upload._id, comment._id)} size="xs" />}
                          </Flex>
                        </Box>
                      ))}

                      <Box p={3}>
                        <Textarea
                          placeholder="Add a comment..."
                          size="sm"
                          value={newComment[upload._id] || ""}
                          onChange={(e) => handleCommentChange(e, upload._id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault(); // Prevent the default action to avoid newline
                              handleAddComment(upload._id);
                            }
                          }}
                        />
                        <Button mt={2} size="sm" onClick={() => handleAddComment(upload._id)}>
                          Add Comment
                        </Button>
                      </Box>
                    </Collapse>
                  </Box>
                ))}
          </Box>
          <Modal isOpen={selectedImage !== null} onClose={handleClose} size="full">
            <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
            <ModalContent bg="transparent" boxShadow="none">
              <Box m="auto" position="relative">
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <CloseButton onClick={handleClose} size="lg" color="white" />
                </Box>
                <TransformWrapper>
                  <TransformComponent>
                    <Image src={selectedImage} alt="" width={500} height={400} />
                  </TransformComponent>
                </TransformWrapper>
              </Box>
            </ModalContent>
          </Modal>
          <IconButton aria-label="Filter" icon={<MdFilterList />} onClick={onOpen} position="fixed" top="100px" left="20px" zIndex="1" color="black" bg="white" _hover={{ bg: "gray.300" }} />
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent bg="gray.800" color="white">
                <DrawerCloseButton />
                <DrawerHeader>Filter Options</DrawerHeader>

                <DrawerBody>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
                      Apply Filter
                    </MenuButton>
                    <MenuList>
                      {/* <MenuItem onClick={filterMostLiked}>Most Liked</MenuItem> */}
                      {/* <MenuItem onClick={filterMostDisliked}>Most Disliked</MenuItem> */}
                    </MenuList>
                  </Menu>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      ) : (
        <CardsTemplate />
      )}
    </>
  );
}
