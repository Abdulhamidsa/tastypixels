import { Box, Button, Text, Spinner } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const VoteButton = ({ upload, handleVote, loadingVote, isAuthenticated }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Button aria-label="Like" onClick={() => handleVote(upload._id, "like")} colorScheme={upload.isLiked ? "green" : "gray"} variant="outline" disabled={!isAuthenticated}>
          {loadingVote[upload._id] === "like" ? <Spinner size="sm" /> : <FaArrowUp />}
        </Button>
        <Text mx={2}>{upload.likes}</Text>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Button aria-label="Dislike" onClick={() => handleVote(upload._id, "dislike")} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline" disabled={!isAuthenticated}>
          {loadingVote[upload._id] === "dislike" ? <Spinner size="sm" /> : <FaArrowDown />}
        </Button>
        <Text mx={2}>{upload.dislikes}</Text>
      </Box>
    </>
  );
};

export default VoteButton;
