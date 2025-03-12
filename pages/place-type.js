import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function PlaceTypePage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    // Retrieve location from localStorage
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) setUserLocation(storedLocation);
  }, []);

  // Handle selection
  const handleSelect = (placeType) => {
    // Store user's choice
    localStorage.setItem("placeType", placeType);

    // Navigate to the next page
    router.push("/preferences");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>What kind of place are you looking for?</h1>
      <p style={styles.subheading}>📍 Searching near: <strong>{userLocation || "..."}</strong></p>

      <div style={styles.optionsContainer}>
        {["Restaurant", "Café", "Bar", "Fast Food", "Bakery"].map((type) => (
          <button key={type} style={styles.button} onClick={() => handleSelect(type)}>
            {type}
          </button>
        ))}
      </div>
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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px",
  },
};
