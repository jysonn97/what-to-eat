import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query; // Get location from URL

  // State variables
  const [question, setQuestion] = useState("📍 Where are you looking to eat?");
  const [options, setOptions] = useState(["Restaurant", "Cafe", "Bar", "Food Truck"]); // ✅ User must select from these
  const [answers, setAnswers] = useState(location ? [{ question: "Location", answer: location }] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle user selection
  const handleOptionSelect = async (selectedOption) => {
    setLoading(true);
    setError("");

    const updatedAnswers = [...answers, { question, answer: selectedOption }];

    console.log("📤 Sending request to:", `${process.env.NEXT_PUBLIC_API_URL}/api/generateQuestion`);
    console.log("📦 Request Body:", JSON.stringify({ previousAnswers: updatedAnswers }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateQuestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: updatedAnswers }),
      });

      const data = await response.json();
      console.log("📥 Response Data:", data); // ✅ Debug API response

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setAnswers(updatedAnswers);
        setOptions(data.options || []); // ✅ If API provides new options, update them
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`);
      }
    } catch (error) {
      console.error("⚠️ API Request Failed:", error);
      setError("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{question}</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.buttonContainer}>
        {options.map((option, index) => (
          <button
            key={index}
            style={styles.optionButton}
            onClick={() => handleOptionSelect(option)}
            disabled={loading}
          >
            {option}
          </button>
        ))}
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
    fontFamily: "Aptos, sans-serif",
    textAlign: "center",
    padding: "0 20px",
  },
  title: {
    fontSize: "clamp(22px, 3vw, 36px)",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginTop: "20px",
  },
  optionButton: {
    fontSize: "18px",
    padding: "12px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
  },
};
