import '@/styles/globals.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '@/components/theme';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';

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
