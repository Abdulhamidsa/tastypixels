import { useEffect, useState } from "react";

const TastyPixelsPage = () => {
  const [isFromPortfolio, setIsFromPortfolio] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    const portfolioUrl = "https://abdulhamid-sa.vercel.app";

    if (referrer.includes(portfolioUrl)) {
      setIsFromPortfolio(true);
    }
  }, []);

  const handleBackToPortfolio = () => {
    // Redirect the user back to your portfolio
    window.location.href = "https://abdulhamid-sa.vercel.app";
  };

  return (
    <div className="tasty-pixels-container">
      {isFromPortfolio && (
        <>
          <h1>Welcome to TastyPixels!</h1>
          <button onClick={handleBackToPortfolio} className="back-to-portfolio-btn">
            Back to My Portfolio
          </button>
        </>
      )}
    </div>
  );
};

export default TastyPixelsPage;
