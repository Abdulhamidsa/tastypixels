import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const BackToPortfolioButton = () => {
  const router = useRouter();
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    if (router.query.from === "portfolio") {
      setIsFromPortfolio(true);
    }
  }, [router.query]);

  const handleBackToPortfolio = () => {
    router.push("https://abdulhamid-sa.vercel.app/projects");
  };

  return (
    isFromPortfolio && (
      <button onClick={handleBackToPortfolio} className="back-to-portfolio-btn">
        Back to My Portfolio
      </button>
    )
  );
};

export default BackToPortfolioButton;
