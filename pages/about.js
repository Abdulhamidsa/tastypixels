import { Box, Badge, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function About() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/api-get-photos");
        if (!res.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = await res.json();
        setPhotos(data);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  console.log("Photos:", photos);

  return (
    <>
      <Box>
        sss
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
