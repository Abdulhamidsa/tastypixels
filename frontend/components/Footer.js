import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box p={5} zIndex="1" mt="auto" position="relative" bg="rgba(0, 0, 0, 0.5)" as="footer" backdropFilter="blur(5px)">
      <Text fontSize="sm" textAlign="center">
        © {new Date().getFullYear()} TastyPixels. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
