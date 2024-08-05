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
  const [addingComment, setAddingComment] = useState(false);
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

        const response = await fetchWithTokenRefresh(`https://tastypixels-production.up.railway.app/api/comments?uploadId=${uploadId}`);
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

  const handleAddComment = async (uploadId, commentText) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to comment",
        status: "warning",
        isClosable: true,
      });
      return null;
    }

    if (!commentText.trim()) return null;

    setAddingComment(true);
    console.log("Adding comment started");

    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-production.up.railway.app/api/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadId,
          text: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();

      toast({
        title: "Comment added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        isClosable: true,
      });
      return null;
    } finally {
      setAddingComment(false);
      console.log("Adding comment finished");
    }
  };

  const handleDeleteComment = async (uploadId, commentId) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to delete comments",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    setDeletingCommentId(commentId);

    try {
      const response = await fetchWithTokenRefresh("https://tastypixels-production.up.railway.app/api/delete-comment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prevComments) => ({
        ...prevComments,
        [uploadId]: prevComments[uploadId].filter((comment) => comment._id !== commentId),
      }));

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
    setComments,
    showComments,
    loadingComments,
    deletingCommentId,
    handleToggleComments,
    handleAddComment,
    handleDeleteComment,
    addingComment,
  };
};

export default useComments;
