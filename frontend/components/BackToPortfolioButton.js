import { useEffect, useState } from "react";

const BackToPortfolioButton = () => {
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;

    const portfolioUrl = "https://abdulhamid-sa.vercel.app/projects";

    if (referrer.includes(portfolioUrl)) {
      setIsFromPortfolio(true);
    }
  }, []);

  const handleBackToPortfolio = () => {
    window.location.href = "https://abdulhamid-sa.vercel.app/projects";
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
