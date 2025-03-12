import { useState, useEffect } from "react";
import { Box, useDisclosure, useToast, IconButton, Heading, Text } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import FilterDrawer from "@/components/FilterDrawer";
import CardSkeleton from "@/components/CardSkeleton";
import PostCard from "@/hooks/PostCard";
import ImageModal from "@/hooks/ImageModal";
import useFetchData from "@/hooks/useFetchData";
import useVote from "@/hooks/useVote";
import useComments from "@/hooks/useComments";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import Upload from "@/components/Upload";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { uploads, loadingPosts, loadingMore, userData, setUploads, loadMorePosts, hasMore, friendlyId, userName, userRole } = useFetchData();
  const { handleVote, loadingVote } = useVote(uploads, setUploads);
  const { comments, showComments, loadingComments, deletingCommentId, handleToggleComments, handleAddComment, handleDeleteComment } = useComments();
  const [selectedUploadId, setSelectedUploadId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [sortOrder, setSortOrder] = useState("a-z");
  const [currentFilter, setCurrentFilter] = useState("Filter by");

  const [showGoToTop, setShowGoToTop] = useState(false);

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
      <Head>
        <title>Home | Tasty Pixels</title>
      </Head>

      {/* Page Container */}
      <Box p={5} maxW="500px" width="100%" mx="auto" bg="background.dark" color="text.dark">
        <Heading textAlign="center" fontSize="3xl" color="primary.500" mb={6}>
          Feed
        </Heading>
        {loadingPosts ? (
          <Box display="grid" gap="10">
            <CardSkeleton />
            <CardSkeleton />
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={uploads.length}
            next={loadMorePosts}
            hasMore={hasMore}
            endMessage={
              <Text textAlign="center" color="text.dark" mt={4} mb={4}>
                You have seen it all
              </Text>
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
                  isAuthenticated={isAuthenticated}
                  loadingVote={loadingVote}
                  selectedUploadId={selectedUploadId}
                  isOpen={isOpen}
                  onClose={onClose}
                  onOpen={onOpen}
                  friendlyId={friendlyId}
                  userRole={userRole}
                />
              ))}
              {loadingMore && (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              )}
            </Box>
          </InfiniteScroll>
        )}
      </Box>

      {/* Scroll to Top Button */}
      {showGoToTop && <IconButton position="fixed" bottom="50px" right="30px" zIndex="1000" bg="primary.500" color="white" icon={<ArrowUpIcon />} onClick={scrollToTop} _hover={{ bg: "primary.600" }} _active={{ bg: "primary.700" }} />}

      {/* Image Modal */}
      <ImageModal isOpen={selectedImage !== null} onClose={() => setSelectedImage(null)} selectedImage={selectedImage} />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        filterMostLiked={() => setUploads([...uploads].sort((a, b) => b.likes - a.likes))}
        filterMostDisliked={() => setUploads([...uploads].sort((a, b) => b.dislikes - a.dislikes))}
        filterMostCommented={() => setUploads([...uploads].sort((a, b) => b.comments.length - a.comments.length))}
        filterHotPosts={() => {
          setUploads([...uploads].sort((a, b) => b.likes + b.dislikes + b.comments.length - (a.likes + a.dislikes + a.comments.length)));
        }}
        filterPostedRecently={() => setUploads([...uploads].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)))}
        handleSortChange={setSortOrder}
        saveFilterAndCloseDrawer={onClose}
        sortOrder={sortOrder}
        currentFilter={currentFilter}
      />
    </>
  );
}
