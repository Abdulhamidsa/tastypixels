import { Box, Avatar, Heading, Text, Badge, Button, Flex, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaComment, FaFlag } from "react-icons/fa";
import Image from "next/legacy/image";
import CommentSection from "@/components/CommentsSection";
import { useState } from "react";
import { useAuth } from "@/frontend/context/AuthContext";

const UploadItem = ({ upload, onReportOpen, setSelectedUploadId, handleOpen }) => {
  const [loadingVote, setLoadingVote] = useState({});
  const [uploads, setUploads] = useState([]);
  const { isLoggedIn, userId } = useAuth();

  const { isOpen: isCommentOpen, onOpen: onCommentOpen, onClose: onCommentClose } = useDisclosure();

  const handleVote = async (uploadId, action) => {
    setLoadingVote((prev) => ({ ...prev, [uploadId]: action }));
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const responsePromise = fetch("/api/api-update-likes-dislikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId, action }),
      });
      const [response] = await Promise.all([responsePromise, timeoutPromise]);
      if (!response.ok) {
        throw new Error("Failed to update likes/dislikes");
      }
      const data = await response.json();
      const updatedUploads = uploads.map((upload) =>
        upload._id === uploadId
          ? {
              ...upload,
              isLiked: action === "like" ? !upload.isLiked : false,
              isDisliked: action === "dislike" ? !upload.isDisliked : false,
              likes: data.upload.likes,
              dislikes: data.upload.dislikes,
            }
          : upload
      );

      setUploads(updatedUploads);
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
    } finally {
      setLoadingVote((prev) => ({ ...prev, [uploadId]: null }));
    }
  };

  return (
    <Box position="relative" borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.800">
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
        <Image alt={upload.imageUrl} src={upload.imageUrl} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} onClick={() => handleOpen(upload.imageUrl)} />
      </Box>
      <Box p="4" bg="gray.200" color="black">
        <Flex alignItems="center">
          <Flex alignItems="center" mr="2">
            <IconButton icon={<FaArrowUp />} isLoading={loadingVote[upload._id] === "like"} colorScheme={upload.isLiked ? "blue" : "gray"} aria-label="Upvote" onClick={() => handleVote(upload._id, "like")} />
            <Text mx="2">{upload.likes}</Text>
            <IconButton icon={<FaArrowDown />} isLoading={loadingVote[upload._id] === "dislike"} colorScheme={upload.isDisliked ? "red" : "gray"} aria-label="Downvote" onClick={() => handleVote(upload._id, "dislike")} />
            <Text mx="2">{upload.dislikes}</Text>
          </Flex>
          <IconButton icon={<FaComment />} aria-label="Comment" onClick={onCommentOpen} />
          <IconButton
            icon={<FaFlag />}
            aria-label="Report"
            onClick={() => {
              onReportOpen();
              setSelectedUploadId(upload._id);
            }}
          />
        </Flex>
        <CommentSection uploadId={upload._id} isOpen={isCommentOpen} onClose={onCommentClose} />
      </Box>
    </Box>
  );
};

export default UploadItem;
