import React, { useState, useEffect } from "react";
import { Box, Flex, Avatar, Text, Skeleton, IconButton, Textarea, Spinner, useToast } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { fetchWithTokenRefresh } from "@/util/auth";
import { useAuth } from "@/context/AuthContext";

const CommentsSection = ({ uploadId, userId, comments, fetchComments, handleDeleteComment, handleAddComment, showComments, loadingComments, deletingCommentId }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const toast = useToast();

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
      const response = await fetchWithTokenRefresh("http://localhost:8000/api/add-comment", {
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

      const addedComment = await response.json();
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 6) {
      return `${diffDays}d`;
    } else {
      const diffWeeks = Math.ceil(diffDays / 7);
      return `${diffWeeks}w`;
    }
  };

  return (
    <Box>
      {loadingComments ? (
        <Box w="100%">
          {[...Array(3)].map((_, index) => (
            <Box key={index} p={2} borderWidth="1px" w="100%">
              <Flex alignItems="center" mb={1}>
                <Skeleton circle height="30px" width="30px" borderRadius="50%" />
                <Skeleton ml={2} height="15px" width="80px" />
              </Flex>
              <Skeleton height="30px" width="100%" />
            </Box>
          ))}
        </Box>
      ) : (
        <Box w="100%">
          {comments.map((comment) => (
            <Box key={comment._id} p={4} borderWidth="1px" borderRadius="md" w="100%" mb={4}>
              <Flex alignItems="center" mb={2}>
                <Avatar size="sm" name={comment.username} />
                <Flex justifyContent="space-between" alignItems="center">
                  {comment.userId === userId && (deletingCommentId === comment._id ? <Spinner size="xs" /> : <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => handleDeleteComment(uploadId, comment._id)} size="xs" variant="ghost" colorScheme="red" />)}
                </Flex>
                <Box ml={3}>
                  <Text fontWeight="bold">{comment.username}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {getTimeAgo(comment.createdAt)}
                  </Text>
                </Box>
              </Flex>
              <Text mb={2}>{comment.text}</Text>
            </Box>
          ))}
          <Box pt={4} display="flex" alignItems="center">
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
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection;
