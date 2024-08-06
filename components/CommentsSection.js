import React, { useState, useEffect } from "react";
import { Box, Flex, Avatar, Text, Skeleton, IconButton, Textarea, Button, Spinner, useToast } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { fetchWithTokenRefresh } from "@/util/auth";
import { useAuth } from "@/context/AuthContext";

const CommentsSection = ({ uploadId, userId, comments, fetchComments, handleDeleteComment, showComments, loadingComments, deletingCommentId }) => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const toast = useToast();
  const currentUsername = state?.user?.username;

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
      const response = await fetchWithTokenRefresh("https://tastypixels-production.up.railway.app/api/add-comment", {
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
  const handleShowMore = () => {
    setIsExpanded(true);
    setVisibleCommentsCount(comments.length);
  };

  const handleShowLess = () => {
    setIsExpanded(false);
    setVisibleCommentsCount(3);
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
          {[...Array(comments.length || 3)].map((_, index) => (
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
          {comments.slice(0, visibleCommentsCount).map((comment) => (
            <Box key={comment._id} p={4} borderWidth="1px" borderRadius="md" w="100%" mb={4}>
              <Flex alignItems="center" mb={2}>
                <Avatar size="sm" name={comment.username} />
                <Flex justifyContent="space-between" alignItems="center">
                  (deletingCommentId === comment._id ? <Spinner size="xs" /> : <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => handleDeleteComment(uploadId, comment._id)} size="xs" variant="ghost" colorScheme="red" />)
                </Flex>
                <Text ml={2} fontWeight="bold">
                  {comment.username}
                </Text>
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
          {comments.length > 3 && (
            <Button onClick={isExpanded ? handleShowLess : handleShowMore} mt={2} variant="link" colorScheme="teal">
              {isExpanded ? "Show less comments" : "Show more comments"}
            </Button>
          )}
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
