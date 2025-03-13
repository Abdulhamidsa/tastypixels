"use client";

import { Suspense, useEffect, useState } from "react";
import { Button, Box } from "@chakra-ui/react";
import { ArrowLeftCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "fromPortfolio";
const EXPIRATION_TIME = 2 * 60 * 1000;

const BackToPortfolioButton = () => {
  return (
    <Suspense fallback={null}>
      <BackToPortfolioLogic />
    </Suspense>
  );
};

const BackToPortfolioLogic = () => {
  const searchParams = useSearchParams();
  const [isFromPortfolio, setIsFromPortfolio] = useState(() => {
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    if (!storedData) return false;
    const { timestamp } = JSON.parse(storedData);
    return Date.now() - timestamp < EXPIRATION_TIME;
  });

  useEffect(() => {
    const queryFrom = searchParams?.get("from");

    if (queryFrom === "portfolio") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsFromPortfolio(true);
    }
  }, [searchParams]);

  const handleBackToPortfolio = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = "https://abdulhamid-sa.vercel.app/projects";
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
        sx={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255,255,255,0.15)" }}
        transition="all 0.2s ease"
        _hover={{ boxShadow: "xl", backgroundColor: "rgba(255,255,255,0.25)" }}
        _active={{ transform: "scale(0.95)" }}
      >
        Back to Portfolio
      </Button>
    </Box>
  );
};

export default BackToPortfolioButton;
