import { Modal, Divider, Flex, Button, Avatar, ModalOverlay, ModalContent, useToast, IconButton, Box, Badge, Image, Text, Toast, flexbox, CloseButton, Heading } from "@chakra-ui/react";
import { SearchIcon, WarningIcon } from "@chakra-ui/icons";
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
        <Box p={5} m="auto" maxW="420px" display="grid" gap="10">
          {uploads.map((upload) => {
            return (
              <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxW="600px" mx="auto" my="4" boxShadow="md" bg="gray.900">
                <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
                  <Avatar w="45px" height="45px" name={upload.username} src={upload.userAvatar} mr="4" />
                  <Box position="relative" color="black">
                    <Heading fontSize="25" fontWeight="bold">
                      {upload.username}
                    </Heading>
                    <Text fontSize="sm">{upload.uploadDate}</Text>
                  </Box>
                </Box>
                <Box position="relative" p={3} bg="white" color="black">
                  <Text fontWeight="bold" fontSize="lg">
                    {upload.title}.
                  </Text>

                  <Text pb={2}>{upload.description}.</Text>
                  <Box zIndex={1} bg="red" position="relative">
                    <IconButton aria-label="Zoom image" icon={<SearchIcon />} position="absolute" top="0" right="0" onClick={() => handleOpen(upload.imageUrl)} borderRadius="100" colorScheme="gray" />
                  </Box>
                  <Image position="relative" src={upload.imageUrl} alt={upload.title} width="100%" height="auto" objectFit="cover" />
                </Box>
                <Box position="relative" bg="black" p="4">
                  <Flex justifyContent="center" gap={5} alignItems="center" p="">
                    <Button aria-label="Like photo" leftIcon={liked[upload._id] ? <AiFillHeart /> : <AiOutlineHeart />} colorScheme={liked[upload._id] ? "blue" : "gray"} onClick={() => handleLike(upload._id)}>
                      {liked[upload._id] ? "Liked" : "Like"}
                    </Button>
                    <Button aria-label="Dislike photo" leftIcon={disliked[upload._id] ? <AiFillDislike /> : <AiOutlineDislike />} colorScheme={disliked[upload._id] ? "red" : "gray"} onClick={() => handleDislike(upload._id)}>
                      {disliked[upload._id] ? "Disliked" : "Dislike"}
                    </Button>
                    <WarningIcon cursor="pointer" onClick={() => handleReport(upload._id)} ml="auto" boxSize="6" />
                  </Flex>
                  <Divider my={4} />
                  <Box pl="">
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

                <Modal isOpen={selectedImage !== null} onClose={handleClose} size="full">
                  <ModalOverlay />
                  <ModalContent bg="transparent" boxShadow="none">
                    <CloseButton onClick={handleClose} position="absolute" top="5px" right="5px" />
                    <Box m="auto">
                      <TransformWrapper>
                        <TransformComponent>
                          <Image src={selectedImage} alt="" maxW="91%" maxH="90vh" m="auto" objectFit="contain" />
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
