import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/legacy/image";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isLoggedIn, isLoading } = useAuth();

  // const fontSize = useBreakpointValue({ base: "3xl", md: "2xl", lg: "4xl" });
  const overlayDisplay = useBreakpointValue({ base: "block" });

  return (
    <>
      <Head>
        <title>TASTY PIXELS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box position="absolute" top="0" h="100dvh" w="100%">
        {isLoggedIn ? (
          <>
            <Image src="/bg-main.jpg" alt="Background Image" layout="fill" objectFit="cover" quality={100} priority />
            <Box position="absolute" top="0" h="100dvh" w="100%" bg="rgba(0, 0, 0, 0.5)" display={overlayDisplay} />
            <Flex m="auto" p="3" maxW="550px" direction="column" position="absolute" top="0" right="0" bottom="50" left="0" alignItems="center" justifyContent="center" textAlign="center" spacing={5}>
              <Heading mb="3" fontSize="3xl" fontWeight="bold" color="white">
                Welcome to Tasty Pixels!
              </Heading>
              <Text fontSize="lg" color="white">
                Share your food pictures and enjoy others' culinary creations. Join our community and explore the world of food like never before. Discover new recipes, make new friends, and share your passion for food with the world.
              </Text>
            </Flex>
          </>
        ) : (
          <Flex m="auto" direction="column" position="absolute" top="0" right="0" bottom="50" left="0" alignItems="center" justifyContent="center" textAlign="center" spacing={5}>
            <Text color="white">Login to have access to be able to start uploading and sharing your food pictures with the world.</Text>
          </Flex>
        )}
      </Box>
    </>
  );
}
