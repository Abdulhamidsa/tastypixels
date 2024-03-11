// _app.js
import "@/styles/globals.css";
import Layout from "@/components/Layout"; // adjust the path according to your project structure
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/components/theme"; // adjust the path according to your project structure

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
