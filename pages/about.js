import { Box, Badge, Image, Text } from "@chakra-ui/react";
import clientPromise from "../database/db";

export default function About({ photos }) {
  console.log("Photos:", photos);

  // Calculate the aspect ratio of each image
  const calculateAspectRatio = (width, height) => {
    return width / height;
  };

  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
        {photos.map((photo) => {
          const aspectRatio = calculateAspectRatio(photo.width, photo.height);
          const height = 300 / aspectRatio; // Set a fixed width of 300px and calculate the corresponding height
          return (
            <Box key={photo._id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" height={`${height}px`}>
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                objectFit="cover" // Images will fill the entire available space while maintaining aspect ratio
                width="100%"
                height="auto"
              />

              <Box p="6">
                <Box d="flex" alignItems="baseline">
                  {photo.category.map((category, index) => (
                    <Badge key={`${category}-${index}`} borderRadius="full" px="2" colorScheme="teal" mr="2">
                      {category}
                    </Badge>
                  ))}
                </Box>

                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                  {photo.title}
                </Box>

                <Text mt="2" color="gray.600">
                  {photo.description}
                </Text>

                <Box>
                  {photo.tags.map((tag, index) => (
                    <Badge key={`${tag}-${index}`} borderRadius="full" px="2" colorScheme="blue" mt="2" mr="2">
                      {tag}
                    </Badge>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("tastypixels");
  const data = await db.collection("hims").find({}).toArray();
  const photos = JSON.parse(JSON.stringify(data));
  return {
    props: { photos },
  };
}
