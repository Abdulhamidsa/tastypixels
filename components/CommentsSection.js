import { useState, useEffect } from "react";
import { Box, Button, Flex, Avatar, Text, Badge, Spinner, IconButton, Collapse, Textarea, useToast } from "@chakra-ui/react";
import { FaTimes, FaComment } from "react-icons/fa";

const CommentsSection = ({ uploadId, userId, userData, comments, fetchComments, handleDeleteComment, handleAddComment, showComments, loadingComments, deletingCommentId }) => {
  const [newComment, setNewComment] = useState("");

  const toast = useToast();

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddCommentClick = async () => {
    if (newComment.trim() === "") return; // Prevent empty comments
    await handleAddComment(uploadId, newComment); // Call the function with the uploadId and new comment text
    setNewComment(""); // Clear input after adding comment
  };

  return (
    <>
      <Collapse in={showComments} animateOpacity>
        {loadingComments ? (
          <Spinner size="sm" />
        ) : (
          comments.map((comment) => (
            <Box key={comment._id} p={2} borderWidth="1px" w="100%">
              <Flex alignItems="center" mb={1}>
                <Avatar size="xs" name={comment.username} />
                <Text ml={2} fontWeight="bold">
                  {comment.username}
                </Text>
                {/* {userData.user.userRole === "Admin" && (
                  <Badge ml={2} colorScheme="green" variant="solid">
                    admin
                  </Badge>
                )} */}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{comment.text}</Text>
                {deletingCommentId === comment._id ? <Spinner size="sm" /> : comment.userId === userId && <IconButton aria-label="Delete comment" icon={<FaTimes />} onClick={() => handleDeleteComment(uploadId, comment._id)} size="xs" />}
              </Flex>
            </Box>
          ))
        )}
        <Box p={3}>
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
          />
          <Button mt={2} size="sm" onClick={handleAddCommentClick}>
            Add Comment
          </Button>
        </Box>
      </Collapse>
    </>
  );
};

export default CommentsSection;
