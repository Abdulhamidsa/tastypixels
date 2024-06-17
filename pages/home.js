import { Modal, SkeletonCircle, Spinner, CloseButton, ModalOverlay, ModalContent, Box, Avatar, Text, Badge, Image, Heading, Divider, IconButton, Button, Flex, useToast, Skeleton, SkeletonText } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import CardsTemplate from "@/components/CardsTemplate";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function About() {
  const [uploads, setUploads] = useState([]);
  const { isLoggedIn, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingVote, setLoadingVote] = useState({ like: false, dislike: false });
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
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserAndUploads();
    }
  }, [isLoggedIn, userId, toast]);

  const handleVote = async (uploadId, action) => {
    setLoadingVote((prev) => ({ ...prev, [action]: true }));

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 300));

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
      setLoadingVote((prev) => ({ ...prev, [action]: false }));
    }
  };

  const handleOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleClose = () => setSelectedImage(null);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.900">
                    <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                      <SkeletonCircle size="10" />
                      <Box color="black" ml="4">
                        <SkeletonText mt="2" noOfLines={1} width="100px" />
                        <SkeletonText mt="2" noOfLines={1} width="150px" />
                      </Box>
                    </Box>

                    <Box p={3} bg="white" color="black">
                      <SkeletonText mt="2" noOfLines={1} width="200px" />
                      <SkeletonText mt="2" noOfLines={3} spacing="4" />
                      <Skeleton mt="4" height="200px" />
                    </Box>

                    <Flex direction="row" justify="flex-start" p={4} gap={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="8" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <SkeletonCircle size="8" />
                        <SkeletonText mt="2" noOfLines={1} width="30px" />
                      </Box>
                    </Flex>
                    <Box bg="black" p="4">
                      <Divider my={4} />
                      <SkeletonText mt="2" noOfLines={1} width="80px" />
                      <Box display="flex" flexWrap="wrap">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <Skeleton key={idx} borderRadius="3" height="20px" width="50px" mr="2" mb="2" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))
              : uploads.map((upload) => (
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
                      <Skeleton height="100%" isLoaded={!loading} fadeDuration={0.2}>
                        <Image src={upload.imageUrl} alt={upload.title} width="100%" height="auto" objectFit="cover" />
                      </Skeleton>
                      {/* <Image src={upload.imageUrl} alt={upload.title} width="100%" height="auto" objectFit="cover" /> */}
                    </Box>

                    <Flex direction="row" justify="flex-start" p={4} gap={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Upvote" onClick={() => handleVote(upload._id, "like")} colorScheme={upload.isLiked ? "green" : "gray"} variant="outline">
                          {loadingVote.like ? <Spinner size="sm" /> : <FaArrowUp />}
                        </Button>
                        <Text color="green.700">{upload.likes}</Text>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Button aria-label="Downvote" onClick={() => handleVote(upload._id, "dislike")} colorScheme={upload.isDisliked ? "red" : "gray"} variant="outline">
                          {loadingVote.dislike ? <Spinner size="sm" /> : <FaArrowDown />}
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
          <Modal isOpen={selectedImage !== null} onClose={handleClose} size="full">
            <ModalOverlay bg="rgba(0, 0, 0, 0.9)" />
            <ModalContent bg="transparent" boxShadow="none">
              <Box m="auto" position="relative">
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <CloseButton onClick={handleClose} size="lg" color="white" />
                </Box>{" "}
                <TransformWrapper>
                  <TransformComponent>
                    <Image src={selectedImage} alt="" maxW="100%" maxH="85dvh" m="auto" objectFit="contain" />
                  </TransformComponent>
                </TransformWrapper>
              </Box>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <CardsTemplate />
      )}
    </>
  );
}
