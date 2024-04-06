import React from "react";
import { Box, Spinner, Flex } from "@chakra-ui/react";

function Loading() {
  return (
    <Box position="fixed" top="0" right="0" bottom="0" left="0" bg="rgba(0, 0, 0, 0.4)">
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Spinner size="xl" color="white" />
      </Flex>
    </Box>
  );
}

export default Loading;
// import React from "react";

// function Loading() {
//   return (
//     <div className="loading">
//       <h2>Loading...</h2>
//     </div>
//   );
// }

// export default Loading;
