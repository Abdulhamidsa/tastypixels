import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { Box, Button, Icon, useColorModeValue, SlideFade } from "@chakra-ui/react";

const BackToPortfolioButton = () => {
  const router = useRouter();
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    const queryFrom = router.query.from;

    if (queryFrom === "portfolio") {
      setIsFromPortfolio(true);
      sessionStorage.setItem("fromPortfolio", "true");
    } else if (sessionStorage.getItem("fromPortfolio") === "true") {
      setIsFromPortfolio(true); // Retrieve on page refresh
    }
  }, [router.query]);

  const handleBackToPortfolio = () => {
    router.push("https://abdulhamid-sa.vercel.app/projects");
  };

  if (!isFromPortfolio) return null;

  return (
    <SlideFade in={true} offsetY="20px">
      <Box position="fixed" bottom="20px" left="20px" zIndex="50">
        <Button
          onClick={handleBackToPortfolio}
          leftIcon={<Icon as={ArrowLeftCircle} w={6} h={6} />}
          bg={useColorModeValue("rgba(255, 255, 255, 0.15)", "rgba(0, 0, 0, 0.3)")}
          backdropFilter="blur(10px)"
          color={useColorModeValue("black", "white")}
          size="md"
          rounded="full"
          shadow="lg"
          px={6}
          transition="all 0.3s"
          _hover={{
            shadow: "xl",
            bg: useColorModeValue("rgba(255, 255, 255, 0.25)", "rgba(0, 0, 0, 0.4)"),
          }}
          _active={{ transform: "scale(0.95)" }}
        >
          Back to Portfolio
        </Button>
      </Box>
    </SlideFade>
  );
};

export default BackToPortfolioButton;
