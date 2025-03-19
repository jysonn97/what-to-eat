import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query; // Get location from URL

  // State variables
  const [question, setQuestion] = useState("📍 Where are you looking to eat?");
  const [options, setOptions] = useState(["Restaurant", "Cafe", "Bar", "Food Truck"]); // ✅ Initial choices
  const [answers, setAnswers] = useState(location ? [{ question: "Location", answer: location }] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle user selecting an option
  const handleOptionClick = async (selectedAnswer) => {
    setLoading(true);
    setError("");
    const updatedAnswers = [...answers, { question, answer: selectedAnswer }];

    console.log("📩 Sending API Request with:", updatedAnswers); // ✅ Debugging Log

    try {
      const response = await fetch(`${window.location.origin}/api/generateQuestion`, { // ✅ Uses absolute URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: updatedAnswers }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("📤 API Response:", data); // ✅ Debugging Log

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setAnswers(updatedAnswers);
        setOptions(data.options || []); // ✅ Ensure options update dynamically
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`);
      }
    } catch (error) {
      console.error("❌ API Error:", error); // ✅ Debugging Log
      setError("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{question}</h1>
      {error && <p style={styles.error}>{error}</p>}

      {/* ✅ Render options as buttons */}
      <div style={styles.optionsContainer}>
        {options.length > 0 ? (
          options.map((option, index) => (
            <button key={index} style={styles.optionButton} onClick={() => handleOptionClick(option)} disabled={loading}>
              {option}
            </button>
          ))
        ) : (
          <p>⏳ Loading...</p>
        )}
      </div>

      {loading && <p>⏳ Loading next question...</p>}
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
    fontFamily: "Aptos, sans-serif",
    textAlign: "center",
    padding: "0 20px",
  },
  title: {
    fontSize: "clamp(22px, 3vw, 36px)",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  optionButton: {
    fontSize: "16px",
    padding: "12px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
  },
};
