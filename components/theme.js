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
        bg: props.colorMode === "dark" ? "#212121" : "#ffffff",
        color: props.colorMode === "dark" ? "white" : "black",
        transition: "background-color 1s ease-in-out",
      },
    }),
  },
});

export default theme;
