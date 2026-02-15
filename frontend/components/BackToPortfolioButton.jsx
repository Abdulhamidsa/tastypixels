'use client';
import { useEffect, useState } from 'react';
import { Button, Box } from '@chakra-ui/react';
import { ArrowLeftCircle } from 'lucide-react';
import { useRouter } from 'next/router';

const STORAGE_KEY = 'fromPortfolio';
const EXPIRATION_TIME = 2 * 60 * 1000;

const BackToPortfolioButton = () => {
  const router = useRouter();
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedData = sessionStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const { timestamp } = JSON.parse(storedData);
      if (Date.now() - timestamp < EXPIRATION_TIME) {
        setIsFromPortfolio(true);
      }
    }

    const queryFrom = router.query.from;
    if (queryFrom === 'portfolio') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    }
  }, [router.query]);

  const handleBackToPortfolio = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = 'cv.ab';
  };

  if (!isFromPortfolio) return null;

  return (
    <Box position="fixed" bottom={5} left={5} zIndex="50">
      <Button
        onClick={handleBackToPortfolio}
        leftIcon={<ArrowLeftCircle size={24} />}
        borderRadius="full"
        px={6}
        py={2}
        boxShadow="lg"
        sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.15)' }}
        transition="all 0.2s ease"
        _hover={{ boxShadow: 'xl', backgroundColor: 'rgba(255,255,255,0.25)' }}
        _active={{ transform: 'scale(0.95)' }}
      >
        Back to Portfolio
      </Button>
    </Box>
  );
};

export default BackToPortfolioButton;
