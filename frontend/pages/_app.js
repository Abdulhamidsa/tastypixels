import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/components/theme";
import { AuthProvider } from "@/context/AuthContext";

const Layout = dynamic(() => import("@/components/Layout"), {
  ssr: false,
});

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
