import { Modal, Flex, Button, Avatar, ModalOverlay, ModalContent, useToast, IconButton, Box, Badge, Image, Text, Toast, flexbox, CloseButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { AiOutlineHeart, AiFillHeart, AiOutlineFlag, AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import CardsTemplate from "@/components/CardsTemplate";
import { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Link from "next/link";
export default function About() {
  const [uploads, setUploads] = useState([]);
  const [liked, setLiked] = useState({});
  const [reported, setReported] = useState({});
  const [disliked, setDisliked] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (imageUrl) => setSelectedImage(imageUrl);
  const handleClose = () => setSelectedImage(null);
  const handleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (disliked[id]) setDisliked((prev) => ({ ...prev, [id]: false }));
  };
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const savedDislikes = JSON.parse(localStorage.getItem("dislikes")) || {};
    setLiked(savedLikes);
    setDisliked(savedDislikes);
  }, []);

  // Save like and dislike states to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("likes", JSON.stringify(liked));
    localStorage.setItem("dislikes", JSON.stringify(disliked));
  }, [liked, disliked]);
  const handleDislike = (id) => {
    setDisliked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (liked[id]) setLiked((prev) => ({ ...prev, [id]: false }));
  };
  useEffect(() => {
    const fetchUploads = async () => {
      const res = await fetch("/api/api-fetch-recipe");
      const data = await res.json();
      setUploads(data);
    };

    fetchUploads();
  }, []);
  const toast = useToast();
  const { isLoggedIn } = useAuth();
  const calculateAspectRatio = (width, height) => {
    return width / height;
  };

  const handleReport = async (id) => {
    setReported((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    toast({
      title: "Reported",
      description: "The photo has been reported. Thank you for keeping our community safe!",
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <>
      {isLoggedIn ? (
        <Box m="auto" maxW="400px" display="grid" gap={5}>
          {uploads.map((upload) => {
            const aspectRatio = calculateAspectRatio(upload.width, upload.height);
            const height = 100 / aspectRatio;
            return (
              <Box key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="black">
                <Box p="5" display="flex" alignItems="center">
                  <Avatar name={upload.username} src={upload.userAvatar} mr="4" />
                  <Box>
                    <Text fontWeight="bold" color="white">
                      {upload.username}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {upload.uploadDate}
                    </Text>
                  </Box>
                </Box>
                <Box position="relative">
                  <Image src={upload.imageUrl} alt={upload.title} width="100%" height={`${height}px`} objectFit="cover" />
                  <Box position="absolute" bottom="0" left="0" width="100%" bg="rgba(200, 200, 200, 0.5)" p="2">
                    <Text fontSize="lg" fontWeight="bold" color="white">
                      {upload.title}
                    </Text>
                    <Text color="gray.300">{upload.description}</Text>
                  </Box>
                  <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="5px" right="5px" onClick={() => handleOpen(upload.imageUrl)} />
                </Box>
                <Flex justifyContent="space-between" alignItems="center" p="4">
                  <Button aria-label="Like photo" leftIcon={liked[upload._id] ? <AiFillHeart /> : <AiOutlineHeart />} colorScheme={liked[upload._id] ? "red" : "gray"} onClick={() => handleLike(upload._id)}>
                    {liked[upload._id] ? "Liked" : "Like"}
                  </Button>
                  <Button aria-label="Dislike photo" leftIcon={disliked[upload._id] ? <AiFillDislike /> : <AiOutlineDislike />} colorScheme={disliked[upload._id] ? "red" : "gray"} onClick={() => handleDislike(upload._id)}>
                    {disliked[upload._id] ? "Disliked" : "Dislike"}
                  </Button>
                  <Button aria-label="Report photo" leftIcon={<AiOutlineFlag />} colorScheme="gray" onClick={() => handleReport(upload._id)}>
                    Report
                  </Button>
                </Flex>
                <Box p="4">
                  <Badge borderRadius="full" px="2" colorScheme="teal" mb="2">
                    {upload.category}
                  </Badge>
                  <Box display="flex" flexWrap="wrap">
                    {upload.tags &&
                      upload.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} borderRadius="full" px="2" colorScheme="blue" mr="2" mb="2">
                          {tag}
                        </Badge>
                      ))}
                  </Box>
                </Box>
                <Modal isOpen={selectedImage !== null} onClose={handleClose} size="full">
                  <ModalOverlay />
                  <ModalContent bg="transparent" boxShadow="none">
                    <CloseButton onClick={handleClose} position="absolute" top="5px" right="5px" />
                    <Box m="auto">
                      <TransformWrapper>
                        <TransformComponent>
                          <Image src={selectedImage} alt="" maxW="90%" maxH="90vh" m="auto" objectFit="contain" />
                        </TransformComponent>
                      </TransformWrapper>
                    </Box>
                  </ModalContent>
                </Modal>
              </Box>
            );
          })}
        </Box>
      ) : (
        <CardsTemplate />
      )}
    </>
  );
}

// export async function getServerSideProps() {
//   const db = await connectToMongoDB();
//   const data = await db.collection("userdemos").find({}).toArray();

//   const uploads = [];
//   data.forEach((doc) => {
//     if (doc.uploads) {
//       doc.uploads.forEach((upload) => {
//         uploads.push({
//           ...upload,
//           _id: upload._id.toString(),
//           userId: doc._id.toString(),
//           username: doc.username,
//         });
//       });
//     }
//   });

//   return {
//     props: { uploads },
//   };
// }
