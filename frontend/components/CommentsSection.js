import React, { useState } from "react";
import { Box, Flex, Avatar, Text, Skeleton, IconButton, Textarea, Button, Spinner, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import useComments from "@/hooks/useComments";
import { useRef } from "react";
const CommentsSection = ({ disableFeatures, uploadId, comments, fetchComments, handleDeleteComment, loadingComments, deletingCommentId }) => {
  const { state } = useAuth();
  const { isAuthenticated, userId } = state;
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const toast = useToast();
  const { getTimeAgo } = useComments();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const cancelRef = useRef();

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
      fetchComments(uploadId);

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
    } finally {
      setAddingComment(false);
    }
  };

  const handleShowMore = () => {
    setIsExpanded(true);
    setVisibleCommentsCount(comments.length);
  };

  const handleShowLess = () => {
    setIsExpanded(false);
    setVisibleCommentsCount(3);
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
          {comments.slice(0, visibleCommentsCount).map((comment) => (
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
                  {deletingCommentId === comment._id && comment.username === userId ? (
                    <Spinner size="xs" />
                  ) : (
                    comment.userId === userId && <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => onDeleteClick(comment._id)} size="xs" variant="ghost" colorScheme="red" />
                  )}
                  <Text fontSize="xs" color="gray.500">
                    {comment.userId}
                  </Text>
                </Flex>
              </Flex>
              <Text>{comment.text}</Text>
            </Box>
          ))}
          {comments.length > 3 && (
            <Button onClick={isExpanded ? handleShowLess : handleShowMore} mt={2} variant="link" colorScheme="teal">
              {isExpanded ? "Show less comments" : "Show more comments"}
            </Button>
          )}
          {!disableFeatures ? (
            <Box display="flex" alignItems="center">
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
          ) : null}
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
