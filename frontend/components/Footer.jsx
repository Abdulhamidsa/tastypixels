import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="white" py={8} textAlign="center" width="100%" mt="auto">
      <Text fontSize="sm">&copy; {new Date().getFullYear()} Tasty Pixels. All Rights Reserved.</Text>
    </Box>
  );
};

export default Footer;
