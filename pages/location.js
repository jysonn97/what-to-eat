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

  return (
    <div style={styles.container}>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      {/* Location Prompt */}
      <h1 style={styles.heading}>Where area are you in or search for?</h1>

      {/* Location Input Field */}
      <input
        id="location-input"
        type="text"
        placeholder="🔍 Enter your location or use current location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      {/* Next Button */}
      <button style={styles.nextButton} onClick={handleNext}>Next</button>
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
    backgroundColor: "#fff", // Clean white background
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },

  heading: {
    fontSize: "20px",
    fontWeight: "500",
    color: "#333",
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
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },

  nextButton: {
    fontSize: "16px",
    padding: "12px 28px",
    backgroundColor: "#8B5A2B", // Elegant brown shade
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "30px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
};

