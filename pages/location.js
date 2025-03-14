import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GOOGLE_API_KEY } from "../config"; // ✅ Import from local config.js

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => initAutocomplete();
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
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
        setError(""); // ✅ Clear error if valid location is selected
      }
    });
  };

  const handleNext = () => {
    if (!location.trim()) {
      setError("📍 Please enter a valid location from the dropdown.");
      return;
    }

    router.push(`/app?location=${encodeURIComponent(location)}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📍 Where are you?</h1>
      <input
        id="location-input"
        type="text"
        placeholder="Enter a location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button
        style={styles.nextButton}
        onClick={handleNext}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        Next
      </button>
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
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  input: {
    width: "350px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid #ccc",
    textAlign: "center",
    outline: "none",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  nextButton: {
    fontSize: "18px",
    padding: "12px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
    marginTop: "15px",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
};
