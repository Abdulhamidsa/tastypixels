import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import Head from "next/head";
import Image from "next/legacy/image";
import { useAuth } from "@/context/AuthContext";
import { GiPizzaSlice, GiHamburger, GiFrenchFries, GiHotDog } from "react-icons/gi";
import { MdGridOn } from "react-icons/md";
import Loading from "@/components/Loading";

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated, loading } = state;
  const fadeIn = keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
  `;
  const dropIn = keyframes`
    0% { transform: translateY(-100px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  `;
  const slideInFromLeft = keyframes`
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

  const slideInFromRight = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;
  const overlayDisplay = useBreakpointValue({ base: "block" });

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>TASTY PIXELS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box position="absolute" top="0" h={["100dvh", "100vh"]} w="100%">
        <Image src="/bg-main.webp" alt="Background Image" layout="fill" objectFit="cover" quality={100} priority style={{ filter: "brightness(0.6)" }} />
        <Box position="absolute" top="0" h={["100dvh", "100vh"]} w="100%" bg="rgba(0, 0, 0, 0.6)" display={overlayDisplay} />

        {isAuthenticated ? (
          <Flex m="auto" direction="column" position="absolute" top="0" right="0" bottom="50" left="0" alignItems="center" justifyContent="center" textAlign="center" spacing={5}>
            <Heading mb="3" fontSize={{ base: "5xl", md: "7xl" }} fontWeight="bold" display="flex" alignItems="center" flexDirection={{ base: "column", md: "row" }}>
              <Flex alignItems="center" animation={`${slideInFromLeft} 1s ease-in-out forwards`}>
                Tasty
                <Box mx="0.5rem">
                  <GiPizzaSlice />
                </Box>
              </Flex>
              <Flex alignItems="center" mt={{ base: 2, md: 0 }} animation={`${slideInFromRight} 1s ease-in-out forwards`}>
                <Box mx="0.5rem" transform="rotate(175deg)">
                  <MdGridOn />
                </Box>
                Pixels
              </Flex>
            </Heading>
          </Flex>
        ) : (
          <Flex m="auto" direction="column" position="absolute" top="0" right="0" bottom="50" left="0" alignItems="center" justifyContent="center" textAlign="center">
            <Flex w="100%" h="30vh" direction="column" bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" borderRadius="sm" p="7" align="center" justify="center" animation={`${fadeIn} 1.5s ease-in-out forwards`}>
              <Text fontSize="xl" fontWeight="bold" color="white" mb="4">
                Login To Be Part Of The Community
              </Text>
              <Flex gap="2">
                <Box mx="0.5rem" animation={`${dropIn} 1s ease-in-out forwards`} animationdelay="1s" opacity="0">
                  <GiPizzaSlice color="#FF7347" size="2.3em" />
                </Box>
                <Box mx="0.5rem" animation={`${dropIn} 1.5s ease-in-out forwards`} animationdelay="1.5s" opacity="0">
                  <GiHamburger color="#8B4513" size="2.3em" />
                </Box>
                <Box mx="0.5rem" animation={`${dropIn} 2s ease-in-out forwards`} animationdelay="2s" opacity="0">
                  <GiFrenchFries color="#FFD755" size="2.3em" />
                </Box>
                <Box mx="0.5rem" animation={`${dropIn} 2.5s ease-in-out forwards`} animationdelay="2.5s" opacity="0">
                  <GiHotDog color="#DC343C" size="2.3em" />
                </Box>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Box>
    </>
  );
}
