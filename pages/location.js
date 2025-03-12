import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load Google Places API script dynamically
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_PLACES_API_KEY&libraries=places`;
    script.async = true;
    script.onload = () => initAutocomplete();
    document.body.appendChild(script);
  }, []);

  const initAutocomplete = () => {
    const input = document.getElementById("location-input");
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["(cities)"],
      componentRestrictions: { country: "us" }, // Restricts to US; remove if global
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation(place.formatted_address);
      }
    });
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
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
      {/* Import Aptos Font */}
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <h1 style={styles.heading}>📍 Where are you?</h1>
      <p style={styles.subheading}>Enter your location or search for a place.</p>

      <input
        id="location-input"
        type="text"
        placeholder="Enter city or address"
        value={location}
        onChange={handleInputChange}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button onClick={handleNext} style={styles.button}>
        Next
      </button>
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
    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subheading: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#555",
  },
  input: {
    fontSize: "16px",
    padding: "12px",
    width: "300px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    textAlign: "center",
  },
  button: {
    fontSize: "18px",
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
    transition: "0.3s ease",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
};
