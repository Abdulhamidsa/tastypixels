import { useEffect, useState } from "react";
import { fetchWithTokenRefresh } from "@/util/auth";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const useFetchData = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [uploads, setUploads] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [userData, setUserData] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData = {};
        let likedPosts = [];
        let dislikedPosts = [];

        if (isAuthenticated) {
          const userResponse = await fetchWithTokenRefresh("https://tastypixels-production.up.railway.app/users/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }
          userData = await userResponse.json();
          likedPosts = userData.likedPosts || [];
          dislikedPosts = userData.dislikedPosts || [];
          setUserData(userData);
        }

        const postsResponse = await fetchWithTokenRefresh("https://tastypixels-production.up.railway.app/recipes/all-posts", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const postsData = await postsResponse.json();
        const initializedUploads = postsData.map((upload) => ({
          ...upload,
          isLiked: likedPosts.some((post) => post.uploadId === upload._id),
          isDisliked: dislikedPosts.some((post) => post.uploadId === upload._id),
        }));

        setUploads(initializedUploads);
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
      }
    };

    fetchData();
  }, [isAuthenticated, toast]);

  return { uploads, loadingPosts, userData, setUploads };
};

export default useFetchData;
