import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function PlaceTypePage() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();
  const { location } = router.query;

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      router.push(`/next-page?location=${encodeURIComponent(location)}&placeType=${encodeURIComponent(selectedType)}`);
    }
  };

  const handleGoBack = () => {
    router.push("/location");
  };

  return (
    <div style={styles.container}>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      {/* Question */}
      <h1 style={styles.heading}>📌 What type of place are you looking for?</h1>

      {/* Place Type Options */}
      <div style={styles.optionsContainer}>
        <div 
          style={{ ...styles.optionCard, borderColor: selectedType === "restaurant" ? "#8B5A2B" : "#ddd" }} 
          onClick={() => handleSelect("restaurant")}
        >
          <span style={styles.icon}>🍴</span>
          <p style={styles.optionText}>Restaurant</p>
        </div>

        <div 
          style={{ ...styles.optionCard, borderColor: selectedType === "bar" ? "#8B5A2B" : "#ddd" }} 
          onClick={() => handleSelect("bar")}
        >
          <span style={styles.icon}>🍺</span>
          <p style={styles.optionText}>Bar / Pub</p>
        </div>

        <div 
          style={{ ...styles.optionCard, borderColor: selectedType === "cafe" ? "#8B5A2B" : "#ddd" }} 
          onClick={() => handleSelect("cafe")}
        >
          <span style={styles.icon}>☕</span>
          <p style={styles.optionText}>Cafe / Dessert</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div style={styles.buttonContainer}>
        <button style={{ ...styles.nextButton, opacity: selectedType ? "1" : "0.6", cursor: selectedType ? "pointer" : "not-allowed" }} onClick={handleNext} disabled={!selectedType}>Next</button>
        <button style={styles.backButton} onClick={handleGoBack}>Go Back</button>
      </div>
    </div>
  );
}

/* Styling */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
    padding: "20px",
  },

  heading: {
    fontSize: "26px", // Bigger for better readability
    fontWeight: "700",
    color: "#222",
    marginBottom: "35px",
  },

  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    alignItems: "center",
  },

  optionCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "320px",
    padding: "15px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "18px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },

  icon: {
    fontSize: "26px", // Slightly bigger for a more engaging UI
  },

  optionText: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px", // More balance
  },

  nextButton: {
    fontSize: "16px",
    padding: "12px 30px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "all 0.3s ease, transform 0.2s ease",
    fontWeight: "600",
    boxShadow: "0px 4px 14px rgba(139, 90, 43, 0.25)",
  },

  backButton: {
    fontSize: "14px",
    padding: "8px 22px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 4px 10px rgba(108, 117, 125, 0.2)",
  },

  /* Hover Effects */
  nextButtonHover: {
    backgroundColor: "#9c6d3d",
    transform: "scale(1.05)",
  },

  backButtonHover: {
    backgroundColor: "#5a6268",
    transform: "scale(1.05)",
  },
};

/* Add hover styles via JavaScript */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.querySelector("button[style*='background-color: #8B5A2B']");
    const backBtn = document.querySelector("button[style*='background-color: #6c757d']");

    if (nextBtn) {
      nextBtn.addEventListener("mouseenter", () => {
        nextBtn.style.backgroundColor = styles.nextButtonHover.backgroundColor;
        nextBtn.style.transform = styles.nextButtonHover.transform;
      });
      nextBtn.addEventListener("mouseleave", () => {
        nextBtn.style.backgroundColor = styles.nextButton.backgroundColor;
        nextBtn.style.transform = "scale(1)";
      });
    }

    if (backBtn) {
      backBtn.addEventListener("mouseenter", () => {
        backBtn.style.backgroundColor = styles.backButtonHover.backgroundColor;
        backBtn.style.transform = styles.backButtonHover.transform;
      });
      backBtn.addEventListener("mouseleave", () => {
        backBtn.style.backgroundColor = styles.backButton.backgroundColor;
        backBtn.style.transform = "scale(1)";
      });
    }
  });
}
