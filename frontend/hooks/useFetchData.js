import { useEffect, useState } from 'react';
import { fetchWithTokenRefresh } from '@/utils/auth';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';
import { getApiUrl } from '@/utils/api';

const useFetchData = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [uploads, setUploads] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userData, setUserData] = useState({});
  const [friendlyId, setFriendlyId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const toast = useToast();

  const fetchData = async (page) => {
    try {
      let userData = {};
      let likedPosts = [];
      let dislikedPosts = [];

      // Fetch user data only if authenticated
      if (isAuthenticated) {
        try {
          const userResponse = await fetchWithTokenRefresh(getApiUrl('/users/profile'));
          if (userResponse.ok) {
            userData = await userResponse.json();
            likedPosts = userData.likedPosts || [];
            dislikedPosts = userData.dislikedPosts || [];

            setUserData(userData);
            setFriendlyId(userData.friendlyId);
            setUserName(userData.username);
            setUserRole(userData.userRole);
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
        }
      }

      // Always fetch posts, regardless of authentication
      const postsResponse = await fetch(getApiUrl(`/recipes/all-posts?page=${page}`));
      if (!postsResponse.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const postsData = await postsResponse.json();
      const uploadsArray = postsData.uploads || [];

      if (uploadsArray.length === 0) {
        setHasMore(false);
      } else {
        const initializedUploads = uploadsArray.map((upload) => ({
          ...upload,
          isLiked: likedPosts.some((post) => post.uploadId === upload._id),
          isDisliked: dislikedPosts.some((post) => post.uploadId === upload._id),
        }));

        setUploads((prevUploads) => {
          const existingUploadIds = new Set(prevUploads.map((upload) => upload._id));
          const uniqueUploads = initializedUploads.filter((upload) => !existingUploadIds.has(upload._id));
          return [...prevUploads, ...uniqueUploads];
        });

        setPage(page + 1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoadingPosts(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // Fetch data on mount, and refetch when authentication status changes
    setUploads([]);
    setPage(1);
    setHasMore(true);
    setLoadingPosts(true);
    fetchData(1);
  }, [isAuthenticated]);

  const loadMorePosts = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      fetchData(page);
    }
  };

  return {
    uploads,
    loadingPosts,
    loadingMore,
    userData,
    setUploads,
    loadMorePosts,
    hasMore,
    friendlyId,
    userName,
    userRole,
  };
};

export default useFetchData;
