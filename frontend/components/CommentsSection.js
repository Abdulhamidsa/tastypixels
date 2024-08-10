import React, { useState, useRef, useEffect } from "react";
import { Box, Flex, Button, Avatar, Text, Skeleton, IconButton, Textarea, Spinner, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import useComments from "@/hooks/useComments";

const CommentsSection = ({ disableFeatures, uploadId, comments, fetchComments, handleDeleteComment, loadingComments, deletingCommentId, friendlyId }) => {
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const toast = useToast();
  const { getTimeAgo } = useComments();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const cancelRef = useRef();
  const { state } = useAuth();
  const { isAuthenticated } = state;

  const commentsContainerRef = useRef(null);
  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: commentsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!loadingComments) {
      scrollToBottom();
    }
  }, [comments, loadingComments]);

  const handleAddCommentClick = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to comment",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    if (!newComment.trim()) return;

    setAddingComment(true);

    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/api/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadId,
          text: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      setNewComment("");
      await fetchComments(uploadId);

      toast({
        title: "Comment added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      scrollToBottom();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        isClosable: true,
      });
    } finally {
      setAddingComment(false);
    }
  };

  const onCloseAlert = () => setIsAlertOpen(false);

  const onDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setIsAlertOpen(true);
  };

  const onConfirmDelete = () => {
    handleDeleteComment(uploadId, commentToDelete);
    onCloseAlert();
  };

  return (
    <Box>
      {loadingComments ? (
        <Box w="100%">
          {[...Array(comments.length || 2)].map((_, index) => (
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
        <Box w="100%">
          <Box
            ref={commentsContainerRef}
            maxH="300px"
            overflowY="auto"
            borderWidth="1px"
            p={2}
            sx={{
              "::-webkit-scrollbar": {
                width: "6px",
              },
              "::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "10px",
              },
              "::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            {comments.map((comment) => (
              <Box key={comment._id} p={3} borderWidth="1px" w="100%">
                <Flex alignItems="center" mb={2}>
                  <Avatar size="sm" name={comment.username} />
                  <Box ml={3}>
                    <Text fontWeight="bold">{comment.username}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {getTimeAgo(comment.createdAt)}
                    </Text>
                  </Box>
                  <Flex justifyContent="space-between" alignItems="center" ml="auto">
                    {deletingCommentId === comment._id && comment.username === friendlyId ? (
                      <Spinner size="xs" />
                    ) : (
                      comment.friendlyId === friendlyId && <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => onDeleteClick(comment._id)} size="xs" variant="ghost" colorScheme="red" />
                    )}
                  </Flex>
                </Flex>
                <Text>{comment.text}</Text>
              </Box>
            ))}
          </Box>

          {!disableFeatures && (
            <Box display="flex" alignItems="center" mt={3}>
              <Textarea
                placeholder="Add a comment..."
                size="sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCommentClick();
                  }
                }}
                resize="none"
                minH="40px"
              />
              <IconButton height="40px" width="40px" borderRadius="none" alignSelf="flex-end" icon={addingComment ? <Spinner size="sm" /> : <MdSend style={{ transform: "rotate(-45deg)" }} />} aria-label="Send Comment" onClick={handleAddCommentClick} variant="outline" />
            </Box>
          )}
        </Box>
      )}

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onCloseAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Comment
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to delete this comment? This action cannot be undone.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CommentsSection;
