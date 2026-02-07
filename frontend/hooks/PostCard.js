import { useState } from 'react';
import {
  Box,
  Avatar,
  Heading,
  Text,
  Badge,
  IconButton,
  Flex,
  Button,
  Collapse,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import { FaComment, FaFlag } from 'react-icons/fa';
import Image from 'next/legacy/image';
import { SearchIcon } from '@chakra-ui/icons';
import VoteButton from '@/hooks/VoteButton';
import CommentsSection from '@/components/CommentsSection';
import useComments from '@/hooks/useComments';
import ImageModal from '@/hooks/ImageModal';
// import { useFetchData } from "@/hooks/useFetchData";
import { useAuth } from '@/context/AuthContext';

const PostCard = ({
  upload,
  userData,
  handleVote,
  handleReportClick,
  isAuthenticated,
  loadingVote,
  friendlyId,
  userRole,
}) => {
  const { comments, loadingComments, deletingCommentId, fetchComments, handleAddComment, handleDeleteComment } =
    useComments();
  // const { uploads } = useFetchData();
  const { state } = useAuth();
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [loadingCommentSection, setLoadingCommentSection] = useState(false);

  const toggleComments = async () => {
    setLoadingCommentSection(true);
    if (!showCommentSection) {
      await fetchComments(upload._id);
    }
    setLoadingCommentSection(false);
    setShowCommentSection(!showCommentSection);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleOpen = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };
  return (
    <Box
      position="relative"
      key={upload._id}
      borderRadius="xl"
      overflow="hidden"
      width="100%"
      maxW="600px"
      mx="auto"
      my="4"
      bg="#0f172a"
      border="1px solid"
      borderColor="gray.700"
      boxShadow="sm"
      transition="all 0.2s ease"
      _hover={{
        boxShadow: 'md',
      }}
    >
      {/* User Header */}
      <Box bg="#111827" p="4" display="flex" alignItems="center" borderBottom="1px solid" borderColor="gray.700">
        <Avatar w="48px" h="48px" name={upload.username} src={upload.userAvatar} mr="3" />
        <Box flex="1">
          <Flex alignItems="center" gap={2}>
            <Heading fontSize="md" fontWeight="600" color="gray.100">
              {upload.username}
            </Heading>
            {upload.userRole === 'admin' && (
              <Badge colorScheme="blue" fontSize="xs" px={2} borderRadius="md" fontWeight="500">
                Admin
              </Badge>
            )}
          </Flex>
          <Text fontSize="xs" color="gray.400">
            {new Date(upload.postedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Box>
      </Box>

      {/* Content Section */}
      <Box p={4} bg="#0f172a">
        <Heading fontSize="lg" fontWeight="600" color="gray.100" mb={2}>
          {upload.title}
        </Heading>
        <Text fontSize="sm" color="gray.300" lineHeight="1.5">
          {upload.description}
        </Text>

        {/* Tags */}
        <Flex flexWrap="wrap" gap={2} mt={3}>
          {upload.tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
              bg="gray.800"
              color="gray.200"
              fontWeight="500"
            >
              #{tag}
            </Badge>
          ))}
        </Flex>
      </Box>

      {/* Image Section */}
      <Box position="relative" overflow="hidden" bg="gray.900">
        <Image
          alt={upload.title}
          src={upload.imageUrl}
          sizes="40vw"
          width={600}
          height={400}
          objectFit="cover"
          layout="responsive"
          priority={false}
          loading="lazy"
        />
        <IconButton
          aria-label="Zoom image"
          icon={<SearchIcon />}
          position="absolute"
          top="3"
          right="3"
          onClick={() => handleOpen(upload.imageUrl)}
          borderRadius="full"
          size="sm"
          bg="blackAlpha.700"
          color="white"
          _hover={{ bg: 'blackAlpha.800' }}
        />
      </Box>
      <ImageModal isOpen={isModalOpen} onClose={handleClose} selectedImage={currentImage} />

      {/* Category Badge */}
      <Box
        bg="#111827"
        color="blue.300"
        textAlign="center"
        py={2}
        px={4}
        fontWeight="600"
        fontSize="xs"
        letterSpacing="wide"
        textTransform="uppercase"
        borderBottom="1px solid"
        borderColor="gray.700"
      >
        {upload.category}
      </Box>

      {/* Actions Section */}
      <Flex p={4} gap={4} bg="#0f172a" alignItems="center" justifyContent="flex-start">
        {/* Upvote & Downvote Section */}
        <VoteButton
          upload={upload}
          handleVote={handleVote}
          loadingVote={loadingVote}
          isAuthenticated={isAuthenticated}
          upvoteColor={upload.hasUpvoted ? 'primary.500' : 'gray.500'}
          downvoteColor={upload.hasDownvoted ? 'secondary.500' : 'gray.500'}
        />

        {/* Comments Button */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Tooltip
            label={!isAuthenticated ? 'Please log in to view and add comments' : ''}
            hasArrow
            placement="top"
            isDisabled={isAuthenticated}
          >
            <Button
              aria-label="Comments"
              onClick={toggleComments}
              bg={showCommentSection ? 'accent.500' : 'transparent'}
              color={showCommentSection ? 'white' : 'gray.500'}
              border="1px solid"
              borderColor={showCommentSection ? 'accent.500' : 'gray.500'}
              _hover={{ bg: 'accent.600', color: 'white' }}
              isLoading={loadingCommentSection}
              disabled={!isAuthenticated}
            >
              <FaComment />
            </Button>
          </Tooltip>
          <Text color="gray.400">{comments[upload._id]?.length ?? upload.comments.length}</Text>
        </Box>

        {/* Report Button */}
        {/* <Button ml="auto" aria-label="Report" onClick={() => handleReportClick(upload._id)} bg="transparent" color="yellow.400" border="1px solid" borderColor="yellow.400" _hover={{ bg: "yellow.100" }} disabled={!isAuthenticated}>
          <FaFlag />
        </Button> */}
      </Flex>

      <Collapse in={showCommentSection} animateOpacity>
        {loadingComments[upload._id] ? (
          <Box w="100%">
            {[...Array(comments[upload._id]?.length || 3)].map((_, index) => (
              <Box key={index} p={2} borderWidth="1px" w="100%">
                <Flex alignItems="center" mb={1}>
                  <Skeleton height="30px" width="30px" borderRadius="50%" />
                  <Skeleton ml={2} height="15px" width="80px" />
                </Flex>
                <Skeleton height="30px" width="100%" />
              </Box>
            ))}
          </Box>
        ) : (
          <CommentsSection
            uploadId={upload._id}
            userId={userData.id}
            comments={comments[upload._id] || []}
            fetchComments={fetchComments}
            handleDeleteComment={handleDeleteComment}
            handleAddComment={handleAddComment}
            showComments={showCommentSection}
            loadingComments={loadingComments[upload._id]}
            deletingCommentId={deletingCommentId}
            friendlyId={friendlyId}
            userRole={userRole}
          />
        )}
      </Collapse>
    </Box>
  );
};

export default PostCard;
