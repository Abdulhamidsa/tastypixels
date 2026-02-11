import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, VStack, SimpleGrid, Avatar, Icon } from '@chakra-ui/react';
import { FaShareAlt, FaUsers } from 'react-icons/fa';
import { MdOutlineFastfood } from 'react-icons/md';
import Head from 'next/head';
import Image from 'next/legacy/image';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import { fetchWithTokenRefresh } from '@/utils/auth';
import NextLink from 'next/link';
import { getApiUrl } from '@/utils/api';
import { Button } from '@chakra-ui/react';

export default function Home() {
  const { state } = useAuth();
  const { isAuthenticated, loading, userName } = state;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRecipes = async () => {
      try {
        const response = await fetchWithTokenRefresh(getApiUrl('/recipes/trending-posts'));
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
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
        <Image
          src="/main-bg.png"
          alt="Delicious food collage"
          layout="fill"
          objectFit="cover"
          priority
          quality={100}
          style={{ filter: 'brightness(0.3)' }}
        />

        {/* Text Content Changes Based on Authentication */}
        <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          direction="column"
          textAlign="center"
          color="white"
          px={{ base: 4, md: 6 }}
        >
          {isAuthenticated ? (
            <VStack spacing={6} maxW="800px">
              <Heading
                fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                fontWeight="700"
                color="white"
                textAlign="center"
                lineHeight="1.2"
              >
                Welcome Back, {userName}!
              </Heading>
              <Text
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                maxW={{ base: '90%', sm: '700px' }}
                textAlign="center"
                fontWeight="400"
                color="whiteAlpha.900"
              >
                Ready to share your next culinary masterpiece?
              </Text>
              <Button
                as={NextLink}
                href="/home"
                size="lg"
                bg="white"
                color="gray.900"
                px={8}
                py={6}
                fontSize="lg"
                fontWeight="600"
                borderRadius="full"
                _hover={{
                  bg: 'gray.100',
                }}
                transition="all 0.2s"
              >
                Explore Recipes
              </Button>
            </VStack>
          ) : (
            <VStack spacing={6} maxW="900px">
              <Heading
                fontSize={{ base: '4xl', sm: '5xl', md: '6xl', lg: '7xl' }}
                fontWeight="700"
                color="white"
                textAlign="center"
                lineHeight="1.2"
              >
                Share. Discover. Savor.
              </Heading>
              <Text
                fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }}
                maxW={{ base: '90%', sm: '700px' }}
                textAlign="center"
                fontWeight="400"
                color="whiteAlpha.900"
                lineHeight="1.6"
              >
                Join the ultimate food-sharing community. Upload dishes, explore trending recipes, and connect with
                passionate food lovers worldwide!
              </Text>
              <Flex gap={4} flexWrap="wrap" justifyContent="center" mt={4}>
                <Button
                  as={NextLink}
                  href="/home"
                  size="lg"
                  bg="white"
                  color="gray.900"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  borderRadius="full"
                  _hover={{
                    bg: 'gray.100',
                  }}
                  transition="all 0.2s"
                >
                  Browse Meals
                </Button>
              </Flex>
            </VStack>
          )}
        </Flex>
      </Box>

      {!isAuthenticated && (
        <>
          {/* HOW IT WORKS */}
          <Box bg="#0f172a" py={{ base: 16, md: 24 }} px={4}>
            <Heading
              textAlign="center"
              color="gray.100"
              fontSize={{ base: '3xl', md: '4xl' }}
              mb={{ base: 8, md: 12 }}
              fontWeight="700"
            >
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 10 }} maxW="1200px" mx="auto">
              <Box
                bg="#111827"
                p={8}
                borderRadius="xl"
                textAlign="center"
                border="1px solid"
                borderColor="gray.700"
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'md',
                }}
              >
                <Box
                  bg="orange.500"
                  borderRadius="full"
                  w="16"
                  h="16"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={FaShareAlt} boxSize={7} color="white" />
                </Box>
                <Text fontSize="xl" fontWeight="600" color="gray.100" mb={3}>
                  Share Your Recipes
                </Text>
                <Text fontSize="md" color="gray.300" lineHeight="1.6">
                  Upload your favorite dishes and inspire food lovers worldwide with your culinary creations.
                </Text>
              </Box>

              <Box
                bg="#111827"
                p={8}
                borderRadius="xl"
                textAlign="center"
                border="1px solid"
                borderColor="gray.700"
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'md',
                }}
              >
                <Box
                  bg="orange.500"
                  borderRadius="full"
                  w="16"
                  h="16"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={MdOutlineFastfood} boxSize={7} color="white" />
                </Box>
                <Text fontSize="xl" fontWeight="600" color="gray.100" mb={3}>
                  Discover Trending Meals
                </Text>
                <Text fontSize="md" color="gray.300" lineHeight="1.6">
                  Explore the best-rated and most loved recipes from our vibrant food community.
                </Text>
              </Box>

              <Box
                bg="#111827"
                p={8}
                borderRadius="xl"
                textAlign="center"
                border="1px solid"
                borderColor="gray.700"
                transition="all 0.2s"
                _hover={{
                  boxShadow: 'md',
                }}
              >
                <Box
                  bg="purple.500"
                  borderRadius="full"
                  w="16"
                  h="16"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={FaUsers} boxSize={7} color="white" />
                </Box>
                <Text fontSize="xl" fontWeight="600" color="gray.100" mb={3}>
                  Connect with Foodies
                </Text>
                <Text fontSize="md" color="gray.300" lineHeight="1.6">
                  Like, comment on dishes, and engage with passionate food enthusiasts from around the globe.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* TRENDING RECIPES */}
          <Box bg="#0b1220" py={{ base: 16, md: 20 }}>
            <Heading textAlign="center" color="gray.100" fontSize={{ base: '3xl', md: '4xl' }} mb={10} fontWeight="700">
              Trending Recipes
            </Heading>

            {isLoading ? (
              <Text textAlign="center" color="gray.300" fontSize="lg">
                Loading trending recipes...
              </Text>
            ) : recipes.length === 0 ? (
              <Text textAlign="center" color="gray.300" fontSize="lg">
                No trending recipes available.
              </Text>
            ) : (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                spacing={6}
                maxW="1200px"
                mx="auto"
                px={5}
                justifyItems="center"
              >
                {recipes.map((recipe) => (
                  <Box
                    w="100%"
                    key={recipe._id}
                    bg="#111827"
                    borderRadius="xl"
                    overflow="hidden"
                    textAlign="center"
                    maxW="320px"
                    border="1px solid"
                    borderColor="gray.700"
                    boxShadow="sm"
                    transition="all 0.2s ease"
                    _hover={{
                      boxShadow: 'md',
                    }}
                  >
                    <Box position="relative" w="100%" h="220px" overflow="hidden">
                      <Image src={recipe.pic} alt={recipe.username} layout="fill" objectFit="cover" quality={100} />
                    </Box>

                    {/* Content Below Image */}
                    <Box p={6}>
                      <Flex align="center" justify="center" mt={-12} mb={4}>
                        <Avatar
                          src={recipe.avatar}
                          name={recipe.username}
                          size="xl"
                          border="4px solid white"
                          boxShadow="md"
                        />
                      </Flex>

                      <Text fontSize="lg" color="gray.100" fontWeight="600" mb={1}>
                        {recipe.username}
                      </Text>
                      <Text fontSize="sm" color="gray.300" noOfLines={2}>
                        {recipe.title || 'Delicious Recipe'}
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
