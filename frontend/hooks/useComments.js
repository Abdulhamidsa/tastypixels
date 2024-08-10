import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";

const useComments = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [addingComment, setAddingComment] = useState(false);
  const toast = useToast();

  const fetchComments = async (uploadId) => {
    setLoadingComments((prev) => ({ ...prev, [uploadId]: true }));
    try {
      const response = await fetchWithTokenRefresh(`https://tastypixels-backend.up.railway.app/api/comments?uploadId=${uploadId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");

      const fetchedComments = await response.json();
      setComments((prev) => ({ ...prev, [uploadId]: fetchedComments }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [uploadId]: false }));
    }
  };

  const handleAddComment = async (uploadId, commentText) => {
    if (!isAuthenticated) {
      toast({ title: "Not authenticated", description: "Please log in to comment", status: "warning", isClosable: true });
      return null;
    }
    if (!commentText.trim()) return null;

    setAddingComment(true);
    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/api/add-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, text: commentText }),
      });
      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();
      toast({ title: "Comment added", status: "success", duration: 3000, isClosable: true });
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: "Error", description: "Failed to add comment", status: "error", isClosable: true });
      return null;
    } finally {
      setAddingComment(false);
    }
  };

  const handleDeleteComment = async (uploadId, commentId) => {
    if (!isAuthenticated) {
      toast({ title: "Not authenticated", description: "Please log in to delete comments", status: "warning", isClosable: true });
      return;
    }

    setDeletingCommentId(commentId);
    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/api/delete-comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!response.ok) throw new Error("Failed to delete comment");

      setComments((prev) => ({
        ...prev,
        [uploadId]: prev[uploadId].filter((comment) => comment._id !== commentId),
      }));
      toast({ title: "Your comment has been deleted", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({ title: "Error", description: "Failed to delete comment. Please try again later.", status: "error", isClosable: true });
    } finally {
      setDeletingCommentId(null);
    }
  };
  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = Math.abs(now - commentDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMinutes === 0) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return `${diffWeeks}w`;
    }
  };

  return {
    comments,
    loadingComments,
    deletingCommentId,
    fetchComments,
    handleAddComment,
    handleDeleteComment,
    addingComment,
    getTimeAgo,
  };
};

export default useComments;
