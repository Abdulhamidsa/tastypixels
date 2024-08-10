import React from "react";
import { Box, Container, Stack, Text, Link, IconButton, Divider, useColorModeValue, Image } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box p={5} zIndex="100" mt="auto" position="relative" bg="rgba(0, 0, 0, 0.5)" as="footer" backdropFilter="blur(5px)">
      <Container as={Stack} maxW="6xl" spacing={2}>
        <Stack direction={{ base: "column", md: "row" }} spacing={10} justify="center" align="center">
          <Box display="flex" alignItems="center">
            <Text fontSize="lg" fontWeight="bold">
              TastyPixels
            </Text>
          </Box>
          <Text fontSize="sm">© {new Date().getFullYear()} TastyPixels. All rights reserved.</Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
