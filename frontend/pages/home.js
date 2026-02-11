import { useState, useEffect } from 'react';
import { Box, useDisclosure, IconButton, Heading, Text, VStack, Button, Flex } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import FilterDrawer from '@/components/FilterDrawer';
import CardSkeleton from '@/components/CardSkeleton';
import PostCard from '@/hooks/PostCard';
import ImageModal from '@/hooks/ImageModal';
import useFetchData from '@/hooks/useFetchData';
import useVote from '@/hooks/useVote';
import useComments from '@/hooks/useComments';
import Upload from '@/components/Upload';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const { uploads, loadingPosts, loadingMore, userData, setUploads, loadMorePosts, hasMore, friendlyId, userRole } =
    useFetchData();
  const { handleVote, loadingVote } = useVote(uploads, setUploads);
  const {
    comments,
    showComments,
    loadingComments,
    deletingCommentId,
    handleToggleComments,
    handleAddComment,
    handleDeleteComment,
  } = useComments();
  const [selectedUploadId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const [sortOrder, setSortOrder] = useState('a-z');
  const [currentFilter] = useState('Filter by');

  const [showGoToTop, setShowGoToTop] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowGoToTop(true);
    } else {
      setShowGoToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Home | Tasty Pixels</title>
      </Head>

      {/* Page Container */}
      <Box
        minH="100vh"
        bg="linear-gradient(180deg, #0b1220 0%, #0f172a 60%, #111827 100%)"
        py={6}
        px={{ base: 3, md: 5 }}
      >
        <Box maxW="700px" mx="auto">
          {/* Header */}
          <Box
            bg="rgba(17, 24, 39, 0.9)"
            p={6}
            borderRadius="xl"
            mb={6}
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.700"
          >
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={4}>
              <Box flex="1">
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.100" fontWeight="700" mb={2}>
                  Feed
                </Heading>
                <Text color="gray.300" fontSize="sm">
                  {isAuthenticated
                    ? 'Discover delicious meals from our community'
                    : 'Browse amazing recipes - Sign in to interact!'}
                </Text>
              </Box>
              {isAuthenticated && (
                <Button
                  bg="primary.500"
                  color="white"
                  size="md"
                  leftIcon={<FiUpload />}
                  _hover={{ bg: 'primary.600' }}
                  onClick={onUploadOpen}
                  whiteSpace="nowrap"
                >
                  Upload Post
                </Button>
              )}
            </Flex>
          </Box>
          {/* Feed Content */}
          {loadingPosts ? (
            <VStack spacing={6}>
              <CardSkeleton />
              <CardSkeleton />
            </VStack>
          ) : (
            <InfiniteScroll
              dataLength={uploads.length}
              next={loadMorePosts}
              hasMore={hasMore}
              endMessage={
                <Box
                  textAlign="center"
                  py={6}
                  px={4}
                  bg="rgba(17, 24, 39, 0.9)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.700"
                  mt={4}
                  mb={4}
                >
                  <Text color="gray.200" fontSize="md" fontWeight="500">
                    You've seen all posts
                  </Text>
                  <Text color="gray.400" fontSize="sm" mt={1}>
                    Check back later for more content
                  </Text>
                </Box>
              }
            >
              <VStack spacing={4}>
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
                  <VStack spacing={4}>
                    <CardSkeleton />
                    <CardSkeleton />
                  </VStack>
                )}
              </VStack>
            </InfiniteScroll>
          )}
        </Box>
      </Box>

      {/* Scroll to Top Button */}
      {showGoToTop && (
        <IconButton
          position="fixed"
          bottom={{ base: '20px', md: '30px' }}
          right={{ base: '20px', md: '30px' }}
          zIndex="1000"
          size="lg"
          borderRadius="full"
          bg="blue.500"
          color="white"
          icon={<ArrowUpIcon boxSize={5} />}
          onClick={scrollToTop}
          boxShadow="lg"
          _hover={{
            bg: 'blue.600',
          }}
          transition="all 0.2s"
        />
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        selectedImage={selectedImage}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        filterMostLiked={() => setUploads([...uploads].sort((a, b) => b.likes - a.likes))}
        filterMostDisliked={() => setUploads([...uploads].sort((a, b) => b.dislikes - a.dislikes))}
        filterMostCommented={() => setUploads([...uploads].sort((a, b) => b.comments.length - a.comments.length))}
        filterHotPosts={() => {
          setUploads(
            [...uploads].sort(
              (a, b) => b.likes + b.dislikes + b.comments.length - (a.likes + a.dislikes + a.comments.length)
            )
          );
        }}
        filterPostedRecently={() =>
          setUploads([...uploads].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)))
        }
        handleSortChange={setSortOrder}
        saveFilterAndCloseDrawer={onClose}
        sortOrder={sortOrder}
        currentFilter={currentFilter}
      />

      {/* Upload Modal */}
      <Upload isOpen={isUploadOpen} onClose={onUploadClose} />
    </>
  );
}
