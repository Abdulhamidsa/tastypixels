import { useState } from "react";
import { Box, Flex, Avatar, Text, Skeleton, IconButton, Collapse, Textarea, Spinner } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { MdSend } from "react-icons/md";

const CommentsSection = ({ uploadId, userId, comments, handleDeleteComment, handleAddComment, showComments, loadingComments, deletingCommentId, addingComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddCommentClick = async () => {
    if (newComment.trim() === "") return;
    await handleAddComment(uploadId, newComment);
    setNewComment("");
  };

  return (
    <>
      <Collapse in={showComments} animateOpacity>
        {loadingComments ? (
          <Box w="100%">
            {[...Array(3)].map((_, index) => (
              <Box key={index} p={2} borderWidth="1px" w="100%">
                <Flex alignItems="center" mb={1}>
                  <Skeleton circle height="30px" width="30px" borderRadius="50%" />
                  <Skeleton ml={2} height="15px" width="80px" />
                </Flex>
                <Skeleton height="30px" width="100%" />
              </Box>
            ))}
          </Box>
        ) : (
          <Box w="100%">
            {comments.map((comment) => (
              <Box key={comment._id} p={2} borderWidth="1px" w="100%">
                <Flex alignItems="center" mb={1}>
                  <Avatar size="xs" name={comment.username} />
                  <Text ml={2} fontWeight="bold">
                    {comment.username}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text>{comment.text}</Text>
                  {deletingCommentId === comment._id ? <Skeleton height="20px" width="20px" /> : comment.userId === userId && <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => handleDeleteComment(uploadId, comment._id)} size="xs" />}
                </Flex>
              </Box>
            ))}
            <Box pt={4} display="flex" alignItems="center">
              <Textarea
                placeholder="Add a comment..."
                size="sm"
                value={newComment}
                onChange={handleCommentChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCommentClick();
                  }
                }}
                resize="none"
                minH="40px"
              />
              <IconButton height="40px" width="40px" borderRadius="none" alignSelf="flex-end" icon={addingComment ? <Spinner size="sm" /> : <MdSend style={{ transform: "rotate(-45deg)" }} />} aria-label="Send Comment" onClick={handleAddCommentClick} variant="outline" />
            </Box>
          </Box>
        )}
      </Collapse>
    </>
  );
};

export default CommentsSection;
