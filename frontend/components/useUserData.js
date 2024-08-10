import { useEffect, useState } from "react";
import { fetchWithTokenRefresh } from "@/utils/auth";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const useFetchData = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [uploads, setUploads] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();

  const fetchData = async (page) => {
    try {
      let userData = {};
      let likedPosts = [];
      let dislikedPosts = [];

      if (isAuthenticated) {
        const userResponse = await fetchWithTokenRefresh("https://tastypixels-backend.up.railway.app/users/profile");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        userData = await userResponse.json();
        likedPosts = userData.likedPosts || [];
        dislikedPosts = userData.dislikedPosts || [];
        setUserData(userData);
      }

      if (isAuthenticated && userData) {
        const postsResponse = await fetchWithTokenRefresh(`https://tastypixels-backend.up.railway.app/recipes/all-posts?page=${page}`);
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const postsData = await postsResponse.json();
        if (postsData.length === 0) {
          setHasMore(false);
        } else {
          const initializedUploads = postsData.map((upload) => ({
            ...upload,
            isLiked: likedPosts.some((post) => post.uploadId === upload._id),
            isDisliked: dislikedPosts.some((post) => post.uploadId === upload._id),
          }));

          setUploads((prevUploads) => [...prevUploads, ...initializedUploads]);
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoadingPosts(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [isAuthenticated]);

  const loadMorePosts = () => {
    if (hasMore) {
      setLoadingMore(true);
      fetchData(page);
    }
  };

  return { uploads, loadingPosts, loadingMore, userData, setUploads, loadMorePosts, hasMore };
};

export default useFetchData;
