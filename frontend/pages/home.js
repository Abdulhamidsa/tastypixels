import { Box, useDisclosure, useToast, Spinner, IconButton } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import FilterDrawer from "@/components/FilterDrawer";
import CardSkeleton from "@/components/CardSkeleton";
import PostCard from "@/hooks/PostCard";
import ImageModal from "@/hooks/ImageModal";
import useFetchData from "@/hooks/useFetchData";
import useVote from "@/hooks/useVote";
import useComments from "@/hooks/useComments";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
export default function About() {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const { uploads, loadingPosts, loadingMore, userData, setUploads, loadMorePosts, hasMore, friendlyId } = useFetchData();
  const { handleVote, loadingVote } = useVote(uploads, setUploads);
  const { comments, showComments, loadingComments, deletingCommentId, handleToggleComments, handleAddComment, handleDeleteComment } = useComments();
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [sortOrder, setSortOrder] = useState("a-z");
  const [currentFilter, setCurrentFilter] = useState("Filter by");

  const [showGoToTop, setShowGoToTop] = useState(false);

  const sortUploads = (order) => {
    const sortedUploads = [...uploads].sort((a, b) => {
      if (order === "a-z") {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
    setUploads(sortedUploads);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    sortUploads(order);
  };

  const handleOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleClose = () => setSelectedImage(null);

  const handleReportClick = (uploadId) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to report",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    setSelectedUploadId(uploadId);
    onOpen();
  };

  const handleReportSubmit = async () => {
    try {
      const response = await fetch("/api/api-report-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData.user._id, uploadId: selectedUploadId }),
      });

      if (response.status === 402) {
        toast({
          title: "Already reported",
          description: "You have already reported this post",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast({
        title: "Report submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        status: "error",
        isClosable: true,
      });
    }
  };

  const confirmReport = () => {
    handleReportSubmit();
  };

  const filterMostLiked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.likes - a.likes);
    setUploads(sortedUploads);
    setCurrentFilter("Most Liked");
  };

  const filterMostDisliked = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.dislikes - a.dislikes);
    setUploads(sortedUploads);
    setCurrentFilter("Most Disliked");
  };
  const filterMostCommented = () => {
    const sortedUploads = [...uploads].sort((a, b) => b.comments.length - a.comments.length);
    setUploads(sortedUploads);
    setCurrentFilter("Most Commented");
  };
  const filterHotPosts = () => {
    const sortedUploads = [...uploads].sort((a, b) => {
      const aInteractions = a.likes + a.dislikes + a.comments.length;
      const bInteractions = b.likes + b.dislikes + b.comments.length;
      return bInteractions - aInteractions;
    });
    setUploads(sortedUploads);
    setCurrentFilter("Hot Posts");
  };
  const filterPostedRecently = () => {
    const sortedUploads = [...uploads].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    setUploads(sortedUploads);
    setCurrentFilter("Posted Recently");
  };

  const saveFilterAndCloseDrawer = () => {
    onClose();
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowGoToTop(true);
    } else {
      setShowGoToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Box p={5} maxW="420px" width="100%" m="auto">
        {loadingPosts ? (
          <Box display="grid" gap="10">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={uploads.length}
            next={loadMorePosts}
            hasMore={hasMore}
            endMessage={
              <Box textAlign="center" mt={4} mb={4}>
                Yay! You have seen it all
              </Box>
            }
          >
            <Box display="grid" gap="10">
              {uploads.map((upload) => (
                <PostCard
                  key={upload._id}
                  upload={upload}
                  userData={userData}
                  handleVote={handleVote}
                  handleToggleComments={handleToggleComments}
                  comments={comments}
                  showComments={showComments}
                  loadingComments={loadingComments}
                  handleAddComment={handleAddComment}
                  handleDeleteComment={handleDeleteComment}
                  deletingCommentId={deletingCommentId}
                  handleReportClick={handleReportClick}
                  isAuthenticated={isAuthenticated}
                  loadingVote={loadingVote}
                  selectedUploadId={selectedUploadId}
                  isOpen={isOpen}
                  onClose={onClose}
                  onOpen={onOpen}
                  handleOpen={handleOpen}
                  friendlyId={friendlyId}
                />
              ))}
              {loadingMore && (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              )}
            </Box>
          </InfiniteScroll>
        )}
      </Box>

      {showGoToTop && <IconButton position="fixed" bottom="50px" right="30px" zIndex="1000" colorScheme="teal" icon={<ArrowUpIcon />} onClick={scrollToTop} />}

      <ImageModal isOpen={selectedImage !== null} onClose={handleClose} selectedImage={selectedImage} />

      <FilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        filterMostLiked={filterMostLiked}
        filterMostDisliked={filterMostDisliked}
        filterMostCommented={filterMostCommented}
        filterHotPosts={filterHotPosts}
        filterPostedRecently={filterPostedRecently}
        handleSortChange={handleSortChange}
        saveFilterAndCloseDrawer={saveFilterAndCloseDrawer}
        sortOrder={sortOrder}
        currentFilter={currentFilter}
      />
    </>
  );
}
