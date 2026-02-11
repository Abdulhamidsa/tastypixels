import { Box, Button, Text, Spinner, Tooltip } from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const VoteButton = ({ upload, handleVote, loadingVote, isAuthenticated }) => {
  const isLoading = loadingVote[upload._id] != null;

  return (
    <>
      {/* Upvote Button */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Tooltip
          label={!isAuthenticated ? 'Please log in to vote' : ''}
          hasArrow
          placement="top"
          isDisabled={isAuthenticated}
        >
          <Button
            aria-label="Like"
            onClick={() => handleVote(upload._id, 'like')}
            bg={upload.isLiked ? 'primary.500' : 'transparent'}
            color={upload.isLiked ? 'white' : 'gray.500'}
            border="1px solid"
            borderColor={upload.isLiked ? 'primary.500' : 'gray.500'}
            _hover={{ bg: 'primary.600', color: 'white' }}
            isDisabled={!isAuthenticated || isLoading}
          >
            {loadingVote[upload._id] === 'like' ? <Spinner size="sm" /> : <FaArrowUp />}
          </Button>
        </Tooltip>
        <Text color="gray.600">{upload.likes}</Text>
      </Box>

      {/* Downvote Button */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Tooltip
          label={!isAuthenticated ? 'Please log in to vote' : ''}
          hasArrow
          placement="top"
          isDisabled={isAuthenticated}
        >
          <Button
            aria-label="Dislike"
            onClick={() => handleVote(upload._id, 'dislike')}
            bg={upload.isDisliked ? 'secondary.500' : 'transparent'}
            color={upload.isDisliked ? 'white' : 'gray.500'}
            border="1px solid"
            borderColor={upload.isDisliked ? 'secondary.500' : 'gray.500'}
            _hover={{ bg: 'secondary.600', color: 'white' }}
            isDisabled={!isAuthenticated || isLoading}
          >
            {loadingVote[upload._id] === 'dislike' ? <Spinner size="sm" /> : <FaArrowDown />}
          </Button>
        </Tooltip>
        <Text color="gray.600">{upload.dislikes}</Text>
      </Box>
    </>
  );
};

export default VoteButton;
