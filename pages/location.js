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
      types: ["geocode"], // Supports both cities & detailed addresses
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
      {/* Import Aptos Font */}
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      {/* Text Box Section */}
      <div style={styles.box}>
        <h1 style={styles.heading}>📍 Where are you?</h1>
        <p style={styles.subheading}>Enter your location or search for a place.</p>

        <input
          id="location-input"
          type="text"
          placeholder="Search for a city, address, or place..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.nextButton} onClick={handleNext}>
          Next
        </button>

        {/* Go Back Button (Smaller Size) */}
        <button style={styles.backButton} onClick={handleGoBack}>
          Go Back
        </button>
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
    background: "linear-gradient(135deg, #ffffff, #f7f8fa)",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  box: {
    background: "#ffffff",
    padding: "40px 50px",
    borderRadius: "12px",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#222",
  },
  subheading: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s ease",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  nextButton: {
    fontSize: "18px",
    padding: "12px 28px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.2)",
  },
  backButton: {
    fontSize: "14px",
    padding: "8px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 8px rgba(108, 117, 125, 0.2)",
  },
};
