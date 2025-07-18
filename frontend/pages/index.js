import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, VStack, SimpleGrid, Avatar, Icon } from "@chakra-ui/react";
import { FaShareAlt, FaUsers } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";
import Head from "next/head";
import Image from "next/legacy/image";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { fetchWithTokenRefresh } from "@/utils/auth";
import NextLink from "next/link";
import { getApiUrl } from "@/utils/api";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated, loading, userName } = state;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const response = await fetchWithTokenRefresh(getApiUrl("/recipes/trending-posts"));
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingRecipes();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>Tasty Pixels - Share & Discover Amazing Food</title>
        <meta name="description" content="Join the biggest food-sharing community and explore delicious recipes!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* HERO SECTION */}
      <Box position="relative" w="100%" h="100dvh" bg="black">
        <Image src="/main-bg.png" alt="Delicious food collage" layout="fill" objectFit="cover" priority quality={100} style={{ filter: "brightness(0.3)" }} />

        {/* Text Content Changes Based on Authentication */}
        <Flex position="absolute" top="0" left="0" right="0" bottom="0" align="center" justify="center" direction="column" textAlign="center" color="white" px={{ base: 4, md: 6 }}>
          {isAuthenticated ? (
            <>
              <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }} fontWeight="bold" color="primary" textAlign="center">
                Welcome Back, {userName}!
              </Heading>
              <Text fontSize={{ base: "md", sm: "lg" }} mt={3} maxW={{ base: "90%", sm: "600px" }} textAlign="center">
                Ready to share your next recipe or explore new dishes?
              </Text>
              <Button as={NextLink} mt="3" href="/home" borderColor="primary.700" variant="solid" size="md">
                Explore recipes
              </Button>
            </>
          ) : (
            <>
              <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }} fontWeight="bold" color="primary" textAlign="center">
                Share. Discover. Enjoy.
              </Heading>
              <Text fontSize={{ base: "md", sm: "lg" }} mt={3} maxW={{ base: "90%", sm: "600px" }} textAlign="center">
                Join the ultimate food-sharing platform. Post your favorite dishes, explore trending recipes, and connect with fellow food lovers!
              </Text>
            </>
          )}
        </Flex>
      </Box>

      {!isAuthenticated && (
        <>
          {/* HOW IT WORKS */}
          <Box bg="background.light" py={{ base: 10, md: 20 }} px={4}>
            <Heading textAlign="center" color="primary.700" fontSize={{ base: "2xl", md: "3xl" }} mb={{ base: 6, md: 10 }}>
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 8 }} maxW="1000px" mx="auto">
              <VStack spacing={4} textAlign="center" px={4}>
                <Icon as={FaShareAlt} boxSize={{ base: 8, md: 10 }} color="primary.500" />
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="text.light">
                  Share Your Recipes
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="text.light">
                  Upload your favorite dishes and inspire food lovers worldwide.
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center" px={4}>
                <Icon as={MdOutlineFastfood} boxSize={{ base: 8, md: 10 }} color="primary.500" />
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="text.light">
                  Discover Trending Meals
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="text.light">
                  Explore the best-rated and most loved recipes from the community.
                </Text>
              </VStack>

              <VStack spacing={4} textAlign="center" px={4}>
                <Icon as={FaUsers} boxSize={{ base: 8, md: 10 }} color="primary.500" />
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="text.light">
                  Connect with Foodies
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="text.light">
                  Like, Comment on dishes, and engage with food lovers.
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>

          {/* TRENDING RECIPES */}
          <Box bg="background.dark" py={20}>
            <Heading textAlign="center" color="white" fontSize="3xl" mb={6}>
              Trending Recipes
            </Heading>

            {isLoading ? (
              <Text textAlign="center" color="white">
                Loading trending recipes...
              </Text>
            ) : recipes.length === 0 ? (
              <Text textAlign="center" color="white">
                No trending recipes available.
              </Text>
            ) : (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={8} maxW="1000px" mx="auto" px={5} justifyItems="center">
                {recipes.map((recipe) => (
                  <Box w="100%" key={recipe._id} bg="white" borderRadius="lg" overflow="hidden" textAlign="center" maxW="280px" transition="transform 0.3s ease-in-out">
                    <Box position="relative" w="100%" h="180px">
                      <Image src={recipe.pic} alt={recipe.username} layout="fill" objectFit="cover" quality={100} style={{ borderRadius: "10px 10px 0 0" }} />
                    </Box>

                    {/* Content Below Image */}
                    <Box p={4}>
                      <Flex align="center" justify="center" mt={-8}>
                        <Avatar src={recipe.avatar} name={recipe.username} size="lg" border="4px solid white" />
                      </Flex>

                      <Text fontSize="lg" color="black" fontWeight="bold" mt={3}>
                        {recipe.username}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {recipe.title || "Delicious Recipe"}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </>
      )}
    </>
  );
}
