import { useToast, IconButton, Box, Badge, Image, Text, Toast, flexbox } from "@chakra-ui/react";
import { AiOutlineHeart, AiFillHeart, AiOutlineFlag } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import connectToMongoDB from "@/database/db";
import CardsTemplate from "@/components/CardsTemplate";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function About() {
  const [uploads, setUploads] = useState([]);

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
  const [liked, setLiked] = useState({});
  const [reported, setReported] = useState({});
  const handleLike = async (id) => {
    setLiked((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    console.log("upload with the id" + id + "is liked");
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
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={5}>
          {uploads.map((upload) => {
            const aspectRatio = calculateAspectRatio(upload.width, upload.height);
            const height = 300 / aspectRatio;
            return (
              <Box position="relative" key={upload._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" height={`${height}px`}>
                <IconButton position="absolute" left="0" aria-label="Like photo" icon={liked[upload._id] ? <AiFillHeart /> : <AiOutlineHeart />} colorScheme={liked[upload._id] ? "red" : "gray"} onClick={() => handleLike(upload._id)} />{" "}
                <IconButton position="absolute" right="0" bottom={0} aria-label="Report photo" icon={<AiOutlineFlag />} color="white" onClick={() => handleReport(upload._id)} />
                <Box width="100%" height="200px">
                  <Image src={upload.imageUrl} alt={upload.title} width="100%" height="100%" objectFit="cover" />
                </Box>
                <Box p={2}>
                  <Box d="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme="teal" mr="2">
                      {upload.category}
                    </Badge>
                  </Box>
                  <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                    <Text fontSize="lg" fontWeight="bold">
                      Title:
                    </Text>
                    {upload.title}
                  </Box>
                  <Box mt="2" color="gray.600">
                    <Text fontSize="lg" fontWeight="bold">
                      Description:
                    </Text>
                    {upload.description}
                  </Box>
                  <Box>
                    {upload.tags &&
                      upload.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} borderRadius="full" px="2" colorScheme="blue" mt="2" mr="2">
                          {tag}
                        </Badge>
                      ))}
                  </Box>
                  Uploaded by User:
                  <Box color="teal.500" decoration="underline">
                    <Link href={`/user/${upload.userId}`} fontWeight="bold">
                      {upload.username}
                    </Link>
                  </Box>
                </Box>
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
