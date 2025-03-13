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

      {/* Logo & Branding */}
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="What to Eat Logo" style={styles.logo} />
        <h2 style={styles.brandName}>What to Eat?</h2>
      </div>

      {/* Box Section */}
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

        <button style={styles.backButton} onClick={handleGoBack}>
          Go Back
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
    background: "linear-gradient(135deg, #f0f4f8, #dbe4ee)", 
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  
  /* Logo & Branding */
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  logo: {
    width: "50px",
    height: "50px",
    objectFit: "contain",
  },
  brandName: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#222",
  },

  box: {
    background: "#ffffff",
    padding: "50px 60px",
    borderRadius: "16px",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)", 
    textAlign: "center",
    maxWidth: "450px",
    width: "100%",
    border: "1px solid #dde5ed",
  },

  heading: {
    fontSize: "38px",
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

  /* Buttons */
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
    minWidth: "140px",
    textAlign: "center",
    display: "block",  // Ensures buttons are stacked
  },
  backButton: {
    fontSize: "14px",
    padding: "8px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "10px",  // Space between buttons
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 8px rgba(108, 117, 125, 0.2)",
    minWidth: "140px",
    textAlign: "center",
    display: "block",
  },
};

