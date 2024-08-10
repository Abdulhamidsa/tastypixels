import React from "react";
import { Box, SkeletonCircle, SkeletonText, Skeleton, Flex } from "@chakra-ui/react";

const CardSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%" maxw="420px" mx="auto" my="4" boxShadow="md" bg="gray.900">
      <Box bg="white" p="4" pb="2" display="flex" alignItems="center">
        <SkeletonCircle size="10" />
        <Box color="black" ml="4">
          <SkeletonText mt="2" noOfLines={1} width="100px" />
          <SkeletonText mt="2" noOfLines={1} width="150px" />
        </Box>
      </Box>

      <Box p={3} mb="5" bg="white" color="black">
        <SkeletonText mt="2" mb="8" noOfLines={1} width="200px" />
        <SkeletonText mt="2" noOfLines={2} spacing="4" />
        <Skeleton mt="4" height="300px" />
      </Box>

      <Flex direction="row" justify="flex-start" p={4} gap={3}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <SkeletonCircle size="9" />
          <SkeletonText mt="2" noOfLines={1} width="30px" />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <SkeletonCircle size="9" />
          <SkeletonText mt="2" noOfLines={1} width="30px" />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <SkeletonCircle size="9" />
          <SkeletonText mt="2" noOfLines={1} width="30px" />
        </Box>
        <Box ml="auto" display="flex" flexDirection="column" alignItems="center" gap={1}>
          <SkeletonCircle size="9" />
        </Box>
      </Flex>
    </Box>
  ));
};

export default CardSkeleton;
