import { useState } from "react";
import { Box, Avatar, Heading, Text, Badge, IconButton, Flex, Button, Collapse, Skeleton } from "@chakra-ui/react";
import { FaComment, FaFlag } from "react-icons/fa";
import Image from "next/legacy/image";
import { SearchIcon } from "@chakra-ui/icons";
import VoteButton from "@/hooks/VoteButton";
import CommentsSection from "@/components/CommentsSection";
import useComments from "@/hooks/useComments";
import ImageModal from "@/hooks/ImageModal";
// import { useFetchData } from "@/hooks/useFetchData";
import { useAuth } from "@/context/AuthContext";

const PostCard = ({ upload, userData, handleVote, handleReportClick, isAuthenticated, loadingVote, friendlyId }) => {
  const { comments, loadingComments, deletingCommentId, fetchComments, handleAddComment, handleDeleteComment } = useComments();
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
  const [currentImage, setCurrentImage] = useState("");

  const handleOpen = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setCurrentImage("");
  };
  return (
    <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" borderBottomRadius="none" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
      <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
        <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="3" />
        <Box color="black">
          <Heading fontSize="xl" fontWeight="bold">
            {upload.username}
          </Heading>
          <Text pt="1" fontSize="xs" color="gray.600">
            Posted at: {new Date(upload.postedAt).toLocaleDateString()}
          </Text>
        </Box>
      </Box>

      <Box p={3} bg="white" color="black">
        <Heading fontSize="xl">{upload.title}</Heading>
        <Text fontSize="md" mb={5}>
          {upload.description}
        </Text>
        <Box position="relative" display="flex" gap={1}>
          {upload.tags.map((tag, index) => (
            <Text fontSize="sm" color="gray.600" pb="2" key={`${tag}-${index}`}>
              {tag}
            </Text>
          ))}
        </Box>
      </Box>
      <Box position="relative" overflow="hidden">
        <Image alt={upload.imageUrl} src={upload.imageUrl} sizes="50vw" width={500} height={400} objectFit="cover" layout="responsive" priority={false} loading="lazy" />
        <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100%" colorScheme="orange" />
      </Box>
      <ImageModal isOpen={isModalOpen} onClose={handleClose} selectedImage={currentImage} />

      <Badge textAlign="center" position="" bottom="0" borderRadius="0" p="3" colorScheme="orange">
        {upload.category}
      </Badge>
      <Flex p={4} gap={3}>
        <VoteButton upload={upload} handleVote={handleVote} loadingVote={loadingVote} isAuthenticated={isAuthenticated} />
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button aria-label="Comments" onClick={toggleComments} colorScheme={showCommentSection ? "teal" : "gray"} variant="outline" isLoading={loadingCommentSection}>
            <FaComment />
          </Button>
          <Text>{comments[upload._id]?.length ?? upload.comments.length}</Text>
        </Box>
        <Button ml="auto" aria-label="Report" onClick={() => handleReportClick(upload._id)} colorScheme="yellow" variant="outline" disabled={!isAuthenticated}>
          <FaFlag />
        </Button>
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
          />
        )}
      </Collapse>
    </Box>
  );
};

export default PostCard;
