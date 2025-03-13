import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [isValidLocation, setIsValidLocation] = useState(false);
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
        setIsValidLocation(true);
        setError(""); // Clear error if valid location is selected
      } else {
        setIsValidLocation(false);
      }
    });

    // Ensure manual typing doesn't allow invalid input
    input.addEventListener("input", () => {
      setIsValidLocation(false);
    });
  };

  const handleNext = () => {
    if (isValidLocation) {
      router.push(`/place-type?location=${encodeURIComponent(location)}`);
    } else {
      setError("Please select a valid location from the list.");
    }
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
        onChange={(e) => setLocation(e.target.value)} // Allow typing but require selection
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      {/* Buttons Section */}
      <div style={styles.buttonContainer}>
        <button 
          style={{ ...styles.nextButton, opacity: isValidLocation ? "1" : "0.6", cursor: isValidLocation ? "pointer" : "not-allowed" }} 
          onClick={handleNext} 
          disabled={!isValidLocation}
        >
          Next
        </button>
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
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },

  nextButton: {
    fontSize: "16px",
    padding: "10px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease, transform 0.2s ease",
    fontWeight: "500",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
};

