import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { fetchWithTokenRefresh } from "@/util/auth";
import { useAuth } from "@/context/AuthContext";

const useComments = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const toast = useToast();

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

  const handleAddComment = async (uploadId, commentText, userData) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to comment",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    if (!commentText.trim()) return;
    try {
      const response = await fetch("/api/api-add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.user._id,
          uploadId,
          text: commentText,
          username: userData.user.username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      await handleToggleComments(uploadId);
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

  const handleDeleteComment = async (uploadId, commentId, userData) => {
    try {
      const commentToDelete = comments[uploadId]?.find((comment) => comment._id === commentId);
      if (!commentToDelete) {
        console.error("Comment not found");
        return;
      }
      if (commentToDelete.userId !== userData.user._id) {
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
          userId: userData.user._id,
          commentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      await handleToggleComments(uploadId);

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

  return {
    comments,
    showComments,
    loadingComments,
    deletingCommentId,
    handleToggleComments,
    handleAddComment,
    handleDeleteComment,
  };
};

export default useComments;
