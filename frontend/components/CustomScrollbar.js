import React from "react";
import Scrollbar from "react-scrollbars-custom";
import { Box, useColorModeValue } from "@chakra-ui/react";

const CustomScrollbar = ({ children, style, ...props }) => {
  const trackBg = useColorModeValue("#f1f1f1", "#333");
  const thumbBg = useColorModeValue("#888", "#555");

  return (
    <Scrollbar
      style={{ width: "100%", height: "100%", ...style }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <Box {...restProps} ref={elementRef} bg={trackBg} />;
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, style, ...restProps } = props;
          return <Box {...restProps} ref={elementRef} bg={thumbBg} borderRadius="10px" {...style} />;
        },
      }}
      {...props}
    >
      {children}
    </Scrollbar>
  );
};

export default CustomScrollbar;
