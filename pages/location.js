import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
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
        setError("");
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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>📍 Where are you?</h1>
        <input
          id="location-input"
          type="text"
          placeholder="Enter a location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.buttonWrapper}>
          <button
            style={styles.button}
            onClick={handleNext}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
    fontFamily: "Inter, sans-serif",
    padding: "0 20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1.5px solid #ccc",
    outline: "none",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    width: "160px",
    padding: "12px 0",
    fontSize: "16px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
