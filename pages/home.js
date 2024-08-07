import { useDisclosure, ModalFooter, Button, ModalHeader, Spinner, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, CloseButton, Box, Avatar, Text, Badge, Heading, IconButton, Flex, useToast, Textarea, Collapse } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import CardsTemplate from "@/components/CardsTemplate";
import { FaArrowUp, FaArrowDown, FaComment, FaFlag, FaTimes } from "react-icons/fa";
import Image from "next/image";
import FilterDrawer from "@/components/FilterDrawer";
import CardSkeleton from "@/components/CardSkeleton";
import CommentsSection from "@/components/CommentsSection";
import ReportModal from "@/components/ReportModal";
export default function About() {
  const [uploads, setUploads] = useState([]);
  // const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  // const cancelRef = useRef();
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const { isLoggedIn, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingVote, setLoadingVote] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});
  const toast = useToast();
  const [loadingComments, setLoadingComments] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [sortOrder, setSortOrder] = useState("a-z");
  const [currentFilter, setCurrentFilter] = useState("Filter by");
  // const containerRef = useRef(null);
  const [userData, setUserData] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [filterOptions, setFilterOptions] = useState({
  //   showLikes: false,
  //   showDislikes: false,
  //   showComments: false,
  // });

  const sortUploads = (order) => {
    const sortedUploads = [...uploads].sort((a, b) => {
      if (order === "a-z") {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
    setUploads(sortedUploads);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    sortUploads(order);
  };

  useEffect(() => {
    const fetchUserAndUploads = async () => {
      sortUploads(sortOrder);

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
    setLoadingVote((prev) => ({ ...prev, [uploadId]: action }));
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
      setLoadingVote((prev) => ({ ...prev, [uploadId]: null }));
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
      const commentsLength = comments.length;
      // console.log(commentsLength);
      setComments((prevComments) => ({
        ...prevComments,
        [uploadId]: comments,
      }));
      return commentsLength;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return 0;
    } finally {
      setLoadingComments((prevLoadingComments) => ({
        ...prevLoadingComments,
        [uploadId]: false,
      }));
    }
  };

  const handleAddComment = async (uploadId, commentText) => {
    if (!commentText.trim()) return;
    try {
      const response = await fetch("/api/api-add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          uploadId,
          text: commentText,
          username: userData.user.username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      await fetchComments(uploadId);
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
        description: "Failed to add comment",
        status: "error",
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
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);
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
      await fetchComments(uploadId);

      toast({
        title: "Your comment has been deleted",
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
  const handleReportClick = (uploadId) => {
    setSelectedUploadId(uploadId);
    onOpen(); // This should open the modal
  };

  const handleReportSubmit = async () => {
    try {
      const response = await fetch("/api/api-report-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId: selectedUploadId }),
      });

      if (response.status === 402) {
        toast({
          title: "Already reported",
          description: "You have already reported this post",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        onReportClose();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast({
        title: "Report submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onReportClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        status: "error",
        isClosable: true,
      });
    }
  };

  const confirmReport = () => {
    handleReportSubmit();
  };

  const filterMostLiked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.likes - a.likes);
    setUploads(sortedUploads);
    setCurrentFilter("Most Liked");
  };

  const filterMostDisliked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.dislikes - a.dislikes);
    setUploads(sortedUploads);
    setCurrentFilter("Most Disliked");
  };

  const saveFilterAndCloseDrawer = () => {
    onClose();
  };
  return (
    <>
      {isLoggedIn ? (
        <>
          <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
            {loading ? (
              <CardSkeleton />
            ) : (
              uploads.map((upload) => (
                <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
                  <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                    <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="3" />
                    <Box color="black">
                      <Heading fontSize="lg" fontWeight="bold">
                        {upload.username}
                      </Heading>
                      <Text fontSize="sm"> Posted at: {new Date(upload.postedAt).toLocaleString()}</Text>
                    </Box>
                  </Box>

                  <Box p={3} bg="white" color="black">
                    <Heading fontSize="xl">{upload.title}</Heading>
                    <Text fontSize="md" mb={5}>
                      {upload.description}
                    </Text>
                    <Box position="relative" display="flex" gap={1}>
                      {upload.tags.map((tag, index) => (
                        <Text fontSize="sm" color="gray.600" pb="2" key={`${tag}-${index}`}>
                          {tag}
                        </Text>
                      ))}
                    </Box>
                  </Box>
                  <Box position="relative" overflow="hidden">
                    <Image
                      alt={upload.imageUrl}
                      src={upload.imageUrl}
                      sizes="100vw"
                      width={200}
                      height={200}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                    <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100%" colorScheme="orange" />
                  </Box>
                  <Badge textAlign="center" position="" bottom="0" borderRadius="0" p="3" colorScheme="orange">
                    {upload.category}
                  </Badge>
                  <Flex p={4} gap={3}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button aria-label="Like" onClick={() => handleVote(upload._id, "like")} colorScheme={upload.isLiked ? "green" : "gray"} variant="outline">
                        {loadingVote[upload._id] === "like" ? <Spinner size="sm" /> : <FaArrowUp />}
                      </Button>
                      <Text mx={2}>{upload.likes}</Text>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button aria-label="Dislike" onClick={() => handleVote(upload._id, "dislike")} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline">
                        {loadingVote[upload._id] === "dislike" ? <Spinner size="sm" /> : <FaArrowDown />}
                      </Button>
                      <Text mx={2}>{upload.dislikes}</Text>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <Button aria-label="Comments" onClick={() => handleToggleComments(upload._id)} colorScheme={showComments[upload._id] ? "teal" : "gray"} variant="outline">
                        <FaComment />
                      </Button>
                      <Text>{comments[upload._id]?.length ?? upload.comments.length}</Text>
                    </Box>
                    <Button ml="auto" aria-label="Report" onClick={() => handleReportClick(upload._id)} colorScheme="yellow" variant="outline">
                      <FaFlag />
                    </Button>

                    <ReportModal isOpen={isOpen} onClose={onClose} onReport={handleReportSubmit} uploadId={selectedUploadId} />
                  </Flex>
                  <CommentsSection
                    uploadId={upload._id}
                    userId={userId}
                    userData={userData}
                    comments={comments[upload._id] || []}
                    fetchComments={handleToggleComments}
                    handleDeleteComment={handleDeleteComment}
                    handleAddComment={handleAddComment}
                    handleToggleComments={handleToggleComments}
                    showComments={showComments[upload._id]}
                    loadingComments={loadingComments[upload._id]}
                    deletingCommentId={deletingCommentId}
                  />
                </Box>
              ))
            )}
          </Box>

          <Modal isOpen={selectedImage !== null} onClose={handleClose} size="full">
            <ModalOverlay />
            <ModalContent bg="transparent" boxShadow="none">
              <Box m="auto" position="relative">
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <CloseButton onClick={handleClose} size="lg" color="white" />
                </Box>
                <TransformWrapper>
                  <TransformComponent>
                    <Image src={selectedImage} alt="dish image" width={500} height={500} />
                  </TransformComponent>
                </TransformWrapper>
              </Box>
            </ModalContent>
          </Modal>
          <FilterDrawer isOpen={isOpen} onClose={onClose} filterMostLiked={filterMostLiked} filterMostDisliked={filterMostDisliked} handleSortChange={handleSortChange} saveFilterAndCloseDrawer={saveFilterAndCloseDrawer} sortOrder={sortOrder} currentFilter={currentFilter} />
        </>
      ) : (
        <CardsTemplate />
      )}
    </>
  );
}
