import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrLFehzKesmzXfSsh2mbFG-PUFEE3aLl0&libraries=places`;
    script.async = true;
    script.onload = () => initAutocomplete();
    document.body.appendChild(script);
  }, []);

  const initAutocomplete = () => {
    const input = document.getElementById("location-input");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["geocode"], 
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation(place.formatted_address);
      }
    });
  };

  const handleNext = () => {
    if (location.trim()) {
      router.push(`/place-type?location=${encodeURIComponent(location)}`);
    } else {
      setError("Please enter a valid location.");
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div style={styles.container}>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      {/* Location Question */}
      <h1 style={styles.heading}>📍 Where are you looking to eat?</h1>

      {/* Location Input Field */}
      <input
        id="location-input"
        type="text"
        placeholder="🔍 Enter a location or use current location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      {/* Buttons Section */}
      <div style={styles.buttonContainer}>
        <button style={styles.nextButton} onClick={handleNext}>Next</button>
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
    fontSize: "24px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "20px",
  },

  input: {
    width: "350px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s ease",
    textAlign: "center",
    color: "#555",
    backgroundColor: "#f9f9f9",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    marginBottom: "15px", // Reduced space between input and buttons
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },

  /* Button Container */
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px", // Reduced space between input and buttons
  },

  nextButton: {
    fontSize: "16px",
    padding: "10px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px", 
    transition: "all 0.3s ease, transform 0.2s ease",
    fontWeight: "500",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },

  backButton: {
    fontSize: "14px",
    padding: "8px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease, transform 0.2s ease",
    boxShadow: "0px 4px 8px rgba(108, 117, 125, 0.2)",
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

/* Add hover styles via JavaScript (for inline styles) */
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
