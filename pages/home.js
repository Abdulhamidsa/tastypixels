import { Button, Flex, Avatar, Text, Box, Badge, Image, Heading, Divider, IconButton, useToast } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import CardsTemplate from "@/components/CardsTemplate";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function About() {
  const [uploads, setUploads] = useState([]);
  const { isLoggedIn, userId } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const fetchUserAndUploads = async () => {
      try {
        const userResponse = await fetch("/api/getUserUploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        const { likedPosts, dislikedPosts, uploads: userUploads } = userData.user;

        const recipesResponse = await fetch("/api/api-fetch-recipe");
        if (!recipesResponse.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const recipesData = await recipesResponse.json();

        const initializedUploads = recipesData.map((upload) => ({
          ...upload,
          isLiked: likedPosts.some((post) => post.uploadId === upload._id),
          isDisliked: dislikedPosts.some((post) => post.uploadId === upload._id),
        }));

        setUploads(initializedUploads);
      } catch (error) {
        console.error("Error fetching user data or recipes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data or recipes",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    if (isLoggedIn) {
      fetchUserAndUploads();
    }
  }, [isLoggedIn, userId, toast]);

  const handleLike = async (uploadId) => {
    try {
      const response = await fetch("/api/api-update-likes-dislikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId, action: "like" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update likes/dislikes");
      }

      const data = await response.json();

      const updatedUploads = uploads.map((upload) =>
        upload._id === uploadId
          ? {
              ...upload,
              isLiked: !upload.isLiked,
              isDisliked: false,
              likes: data.upload.likes,
              dislikes: data.upload.dislikes,
            }
          : upload
      );

      setUploads(updatedUploads);
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
    }
  };

  const handleDislike = async (uploadId) => {
    try {
      const response = await fetch("/api/api-update-likes-dislikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, uploadId, action: "dislike" }),
      });

      if (!response.ok) {
        throw new Error("Failed to update likes/dislikes");
      }

      const data = await response.json();

      const updatedUploads = uploads.map((upload) =>
        upload._id === uploadId
          ? {
              ...upload,
              isLiked: false,
              isDisliked: !upload.isDisliked,
              likes: data.upload.likes,
              dislikes: data.upload.dislikes,
            }
          : upload
      );

      setUploads(updatedUploads);
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
    }
  };
  const handleOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleClose = () => setSelectedImage(null);

  return (
    <>
      {isLoggedIn ? (
        <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
          {uploads.map((upload) => (
            <Box key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.900">
              <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                <Avatar w="45px" h="45px" name={upload.username} src={upload.userAvatar} mr="4" />
                <Box color="black">
                  <Heading fontSize="lg" fontWeight="bold">
                    {upload.username}
                  </Heading>
                  <Text fontSize="sm">{upload.uploadDate}</Text>
                </Box>
              </Box>

              <Box p={3} bg="white" color="black">
                <Heading fontSize="lg" fontWeight="bold">
                  {upload.title}
                </Heading>
                <Text pb={2}>{upload.description}</Text>
                <Box position="relative">
                  <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100%" colorScheme="gray" />
                </Box>
                <Image src={upload.imageUrl} alt={upload.title} width="100%" height="auto" objectFit="cover" />
              </Box>

              <Flex direction="row" justify="flex-start" p={4} gap={3}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <Button aria-label="Upvote" onClick={() => handleLike(upload._id)} colorScheme={upload.isLiked ? "green" : "gray"} variant="outline">
                    <FaArrowUp />
                  </Button>
                  <Text color="green.700">{upload.likes}</Text>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <Button aria-label="Downvote" onClick={() => handleDislike(upload._id)} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline">
                    <FaArrowDown />
                  </Button>
                  <Text color="red.700">{upload.dislikes}</Text>
                </Box>
              </Flex>
              <Box bg="black" p="4">
                <Divider my={4} />
                <Badge borderRadius="3" p="2" colorScheme="blue" mb="2">
                  {upload.category}
                </Badge>
                <Box display="flex" flexWrap="wrap">
                  {upload.tags &&
                    upload.tags.map((tag, index) => (
                      <Badge key={`${tag}-${index}`} borderRadius="3" borderColor="red" border="" px="2" colorScheme="green" mr="2" mb="2">
                        {tag}
                      </Badge>
                    ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <CardsTemplate />
      )}
    </>
  );
}
