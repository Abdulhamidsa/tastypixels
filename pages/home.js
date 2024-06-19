import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  VStack,
  Checkbox,
  Button,
  SkeletonCircle,
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
import { SearchIcon } from "@chakra-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import CardsTemplate from "@/components/CardsTemplate";
import { FaArrowUp, FaArrowDown, FaComment, FaFlag, FaThumbsUp, FaThumbsDown, FaHeart, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function About() {
  const [uploads, setUploads] = useState([]);
  const { isLoggedIn, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingVote, setLoadingVote] = useState({ like: false, dislike: false });
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterOptions, setFilterOptions] = useState({
    showLikes: false,
    showDislikes: false,
    showComments: false,
  });
  // Filter uploads by most liked
  const filterMostLiked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.likes - a.likes);
    setUploads(sortedUploads);
    onClose(); // Close filter drawer after applying filter
  };

  // Filter uploads by most disliked
  const filterMostDisliked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.dislikes - a.dislikes);
    setUploads(sortedUploads);
    onClose(); // Close filter drawer after applying filter
  };
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
          duration: 9000,
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

  const handleComments = (uploadId) => {
    const isShowing = showComments[uploadId];
    setShowComments({ ...showComments, [uploadId]: !isShowing });

    if (!isShowing) {
      setComments({
        ...comments,
        [uploadId]: [
          { id: 1, username: "JohnDoe", text: "Great dish!" },
          { id: 2, username: "JaneDoe", text: "Looks delicious!" },
        ],
      });
      setNewComment({ ...newComment, [uploadId]: "" });
    }
  };

  const handleAddComment = (uploadId) => {
    if (newComment[uploadId]?.trim()) {
      const newCommentData = {
        id: comments[uploadId]?.length + 1 || 1,
        username: "CurrentUser",
        text: newComment[uploadId],
      };

      setComments({
        ...comments,
        [uploadId]: [...(comments[uploadId] || []), newCommentData],
      });

      setNewComment({ ...newComment, [uploadId]: "" });
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

                    <Box p={3} bg="white" color="black">
                      <SkeletonText mt="2" noOfLines={1} width="200px" />
                      <SkeletonText mt="2" noOfLines={3} spacing="4" />
                      <Skeleton mt="4" height="200px" />
                    </Box>

                    <Flex direction="row" justify="flex-start" p={4} gap={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="8" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="8" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                    </Flex>
                    <Box bg="black" p="4">
                      <Divider my={4} />
                      <SkeletonText mt="2" noOfLines={1} width="80px" />
                      <Box display="flex" flexWrap="wrap">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Skeleton key={idx} borderRadius="3" height="20px" width="50px" mr="2" mb="2" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))
              : uploads.map((upload) => (
                  <Box key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
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
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Downvote" onClick={() => handleVote(upload._id, "dislike")} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline">
                          {loadingVote.dislike ? <Spinner size="sm" /> : <FaArrowDown />}
                        </Button>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Comments" onClick={() => handleComments(upload._id)} colorScheme={showComments[upload._id] ? "blue" : "gray"} variant="outline" isActive={showComments[upload._id]}>
                          <FaComment />
                        </Button>
                      </Box>
                      <Box ml="auto" display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Report" onClick={() => handleReport(upload._id)} colorScheme="yellow" variant="outline">
                          <FaFlag />
                        </Button>
                      </Box>
                    </Flex>

                    <Collapse in={showComments[upload._id]} animateOpacity>
                      <Box p={5} bg="gray.700" borderTop="1px solid gray">
                        <Heading size="md" mb={4}>
                          Comments
                        </Heading>
                        <Divider mb={4} />
                        {comments[upload._id]?.map((comment) => (
                          <Box key={comment.id} mb={4}>
                            <Text fontWeight="bold">{comment.username}</Text>
                            <Text>{comment.text}</Text>
                            <Divider mt={2} />
                          </Box>
                        ))}
                        <Box mt={4}>
                          <Textarea placeholder="Add a comment" value={newComment[upload._id] || ""} onChange={(e) => setNewComment({ ...newComment, [upload._id]: e.target.value })} mb={3} />
                          <Button onClick={() => handleAddComment(upload._id)} colorScheme="blue">
                            Submit
                          </Button>
                        </Box>
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
          <IconButton aria-label="Filter" icon={<SearchIcon />} onClick={onOpen} position="fixed" top="150px" left="20px" zIndex="1" color="black" bg="white" _hover={{ bg: "gray.300" }} />
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent bg="gray.800" color="white">
                <DrawerCloseButton />
                <DrawerHeader>Filter Options</DrawerHeader>

                <DrawerBody>
                  <VStack spacing={4} align="stretch">
                    <Checkbox isChecked={filterOptions.showLikes} onChange={(e) => setFilterOptions({ ...filterOptions, showLikes: e.target.checked })}>
                      Show Most Liked
                    </Checkbox>
                    <Checkbox isChecked={filterOptions.showDislikes} onChange={(e) => setFilterOptions({ ...filterOptions, showDislikes: e.target.checked })}>
                      Show Most Disliked
                    </Checkbox>
                  </VStack>

                  <Button mt={4} colorScheme="blue" onClick={filterMostLiked}>
                    Apply Most Liked
                  </Button>
                  <Button mt={2} colorScheme="red" onClick={filterMostDisliked}>
                    Apply Most Disliked
                  </Button>
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
