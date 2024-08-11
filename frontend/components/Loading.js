import React from "react";
import { Box, Flex, Image, keyframes } from "@chakra-ui/react";
const pulseAnimation = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.5; transform: scale(1); }
`;
function Loading() {
  return (
    <Box zIndex="1500" position="fixed" top="0" right="0" bottom="0" left="0" bg="rgba(0, 0, 0, 0.8)">
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Image src="/logo.png" alt="Loading Logo" boxSize="85px" animation={`${pulseAnimation} 1.5s infinite`} />
      </Flex>
    </Box>
  );
}
export default Loading;
