import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function PlaceTypePage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState("");
  const placeTypes = [
    { name: "Restaurant", emoji: "🍽️" },
    { name: "Café", emoji: "☕" },
    { name: "Bar", emoji: "🍸" },
    { name: "Fast Food", emoji: "🍔" },
    { name: "Bakery", emoji: "🥐" },
  ];

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) setUserLocation(storedLocation);
  }, []);

  const handleSelect = (placeType) => {
    localStorage.setItem("placeType", placeType);
    router.push("/preferences");
  };

  const handleGoBack = () => {
    localStorage.removeItem("userLocation");
    router.push("/location");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>What kind of place are you looking for?</h1>
      <p style={styles.subheading}>📍 Searching near: <strong>{userLocation || "..."}</strong></p>

      <div style={styles.optionsContainer}>
        {placeTypes.map((type) => (
          <button key={type.name} style={styles.choiceButton} onClick={() => handleSelect(type.name)}>
            <span style={{ marginRight: "10px" }}>{type.emoji}</span> {type.name}
          </button>
        ))}
      </div>

      <button style={styles.backButton} onClick={handleGoBack}>← Go Back</button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "Aptos, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  optionsContainer: {
    display: "grid",
    gap: "12px",
  },
  choiceButton: {
    fontSize: "16px",
    padding: "12px 24px",
    backgroundColor: "#ffffff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "12px",
    cursor: "pointer",
    width: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
  backButton: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

