import React, { useState } from "react";
import { Collapse } from "@chakra-ui/react"; // Import Collapse component

const CommentSection = ({ uploadId, comments, onAddComment, onDeleteComment, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  console.log(comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(uploadId, newComment);
      setNewComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    onDeleteComment(uploadId, commentId);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  return (
    <div>
      <button onClick={() => setShowComments(!showComments)}>{showComments ? "Hide Comments" : "Show Comments"}</button>
      <Collapse isOpen={showComments}>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.username}: {comment.commentText}
              {currentUser && currentUser.id === comment.userId && <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>}
            </li>
          ))}
        </ul>
        <textarea value={newComment} onChange={handleCommentChange} />
        <button onClick={handleAddComment}>Add Comment</button>
      </Collapse>
    </div>
  );
};

export default CommentSection;
