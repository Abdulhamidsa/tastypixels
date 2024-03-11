// theme.js
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "gray.200",
        color: props.colorMode === "dark" ? "white" : "black",
        transition: "background-color 1s",
      },
    }),
  },
});

export default theme;
