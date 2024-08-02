import { Box, Avatar, Heading, Text, Badge, IconButton, Flex, Button, Spinner } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaComment, FaFlag } from "react-icons/fa";
import Image from "next/image";
import { SearchIcon } from "@chakra-ui/icons";
import VoteButton from "./VoteButton";
import CommentsSection from "@/components/CommentsSection";
import ReportModal from "@/components/ReportModal";

const PostCard = ({
  upload,
  userData,
  handleVote,
  handleToggleComments,
  comments,
  showComments,
  loadingComments,
  handleAddComment,
  handleDeleteComment,
  deletingCommentId,
  handleReportClick,
  isAuthenticated,
  loadingVote,
  selectedUploadId,
  isOpen,
  onClose,
  onOpen,
  handleOpen,
}) => {
  return (
    <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
      <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
        <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="3" />
        <Box color="black">
          <Heading fontSize="lg" fontWeight="bold">
            {upload.username}
          </Heading>
          <Text fontSize="sm"> Posted at: {new Date(upload.postedAt).toLocaleString()}</Text>
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
        <Image
          alt={upload.imageUrl}
          src={upload.imageUrl}
          sizes="100vw"
          width={200}
          height={200}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100%" colorScheme="orange" />
      </Box>
      <Badge textAlign="center" position="" bottom="0" borderRadius="0" p="3" colorScheme="orange">
        {upload.category}
      </Badge>
      <Flex p={4} gap={3}>
        <VoteButton upload={upload} handleVote={handleVote} loadingVote={loadingVote} isAuthenticated={isAuthenticated} />

        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button aria-label="Comments" onClick={() => handleToggleComments(upload._id)} colorScheme={showComments[upload._id] ? "teal" : "gray"} variant="outline">
            <FaComment />
          </Button>
          <Text>{comments[upload._id]?.length ?? upload.comments.length}</Text>
        </Box>
        <Button ml="auto" aria-label="Report" onClick={() => handleReportClick(upload._id)} colorScheme="yellow" variant="outline" disabled={!isAuthenticated}>
          <FaFlag />
        </Button>

        {/* <ReportModal isOpen={isOpen} onClose={onClose} onReport={handleReportSubmit} uploadId={selectedUploadId} /> */}
      </Flex>
      <CommentsSection
        uploadId={upload._id}
        userData={userData}
        comments={comments[upload._id] || []}
        fetchComments={handleToggleComments}
        handleDeleteComment={handleDeleteComment}
        handleAddComment={handleAddComment}
        handleToggleComments={handleToggleComments}
        showComments={showComments[upload._id]}
        loadingComments={loadingComments[upload._id]}
        deletingCommentId={deletingCommentId}
      />
    </Box>
  );
};

export default PostCard;
