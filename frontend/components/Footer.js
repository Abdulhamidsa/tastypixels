import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <Box bg="gray.900" color="white" py={8} textAlign="center">
      <Text fontSize="sm">&copy; {new Date().getFullYear()} Tasty Pixels. All Rights Reserved.</Text>
    </Box>
  );
};

export default Footer;
