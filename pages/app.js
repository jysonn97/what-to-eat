import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query; // Get location from URL

  // State variables
  const [question, setQuestion] = useState("📍 Where are you looking to eat?");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState(location ? [{ question: "Location", answer: location }] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle 'Next' button click
  const handleNext = async () => {
    if (!answer.trim()) {
      setError("⚠️ Please enter a response.");
      return;
    }

    setLoading(true);
    setError("");
    const updatedAnswers = [...answers, { question, answer }];

    try {
      const response = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: updatedAnswers }),
      });

      const data = await response.json();
      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setAnswers(updatedAnswers);
        setAnswer(""); // Reset input field
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`);
      }
    } catch {
      setError("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{question}</h1>
      <input
        style={styles.input}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.nextButton} onClick={handleNext} disabled={loading}>
        {loading ? "Loading..." : "Next"}
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
    fontFamily: "Aptos, sans-serif",
    textAlign: "center",
    padding: "0 20px",
  },
  title: {
    fontSize: "clamp(22px, 3vw, 36px)", // Responsive size
    fontWeight: "bold",
    marginBottom: "15px",
  },
  input: {
    width: "80%",
    maxWidth: "400px",
    fontSize: "18px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
  },
  nextButton: {
    fontSize: "18px",
    padding: "12px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "15px",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
};
