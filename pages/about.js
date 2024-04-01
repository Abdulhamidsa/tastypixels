import { Box, Badge, Image, Text } from "@chakra-ui/react";
import React from "react";

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/api-get-photos");
  const photos = await res.json();
  return { props: { photos } };
}

function about({ photos }) {
  console.log("Photos:", photos);
  return (
    <>
      {" "}
      <Box>
        sss
        {photos.map((photo) => (
          <Box>
            {photos.map((photo) => (
              <Box key={photo._id} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" m={4}>
                <Image src={photo.imageUrl} alt={photo.title} />

                <Box p="6">
                  <Box d="flex" alignItems="baseline">
                    {photo.category.map((category) => (
                      <Badge key={category} borderRadius="full" px="2" colorScheme="teal" mr="2">
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
                    {photo.tags.map((tag) => (
                      <Badge key={tag} borderRadius="full" px="2" colorScheme="blue" mt="2" mr="2">
                        {tag}
                      </Badge>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default about;
