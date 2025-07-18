import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/api";

const useVote = (uploads, setUploads) => {
  const {
    state: { isAuthenticated },
  } = useAuth();
  const [loadingVote, setLoadingVote] = useState({});
  const toast = useToast();

  const handleVote = async (uploadId, action) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to vote",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    // Set loading state only for the specific upload
    setLoadingVote((prev) => ({ ...prev, [uploadId]: action }));

    try {
      const response = await fetchWithTokenRefresh(getApiUrl("/api/update-like-dislike"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploadId, action }),
      });

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
      // Reset the loading state for this upload
      setLoadingVote((prev) => ({ ...prev, [uploadId]: null }));
    }
  };

  return { handleVote, loadingVote };
};

export default useVote;
