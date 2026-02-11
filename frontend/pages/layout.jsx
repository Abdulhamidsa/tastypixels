import Navbar from '@/components/Navbar';
import { createContext } from 'react';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import { Box } from '@chakra-ui/react';
import Footer from '@/components/Footer';
import BackToPortfolioButton from '@/components/BackToPortfolioButton';

import { Analytics } from '@vercel/analytics/react';

export const LoginContext = createContext();

export default function Layout({ children }) {
  const { state } = useAuth();
  const { isLoading } = state;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box display="flex" flexDirection="column" minH="100dvh">
      <Navbar />
      <BackToPortfolioButton />
      {children}
      <Analytics />
      <Footer />
    </Box>
  );
}
