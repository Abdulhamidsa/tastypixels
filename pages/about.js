import { Box, Badge, Image, Text } from "@chakra-ui/react";
import clientPromise from "../database/db";
export default function about({ photos }) {
  console.log("Photos:", photos);
  return (
    <>
      <Box>
        {photos.map((photo) => (
          <Box key={photo._id} m={4}>
            <Image src={photo.imageUrl} alt={photo.title} maxW="sm" borderWidth="1px" borderRadius="lg" />

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
        ))}
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
