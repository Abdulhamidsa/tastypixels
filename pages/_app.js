// _app.js
import "@/styles/globals.css";
import Layout from "@/components/Layout"; // adjust the path according to your project structure
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/components/theme";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext"; // Import useAuth here
// import { useAuth } from "@/context/AuthContext";
// adjust the path according to your project structure

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </AuthProvider>
  );
}
