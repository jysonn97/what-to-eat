import { useState } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("📍 Where are you looking to eat?");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (!answer.trim()) {
      setError("📍 Please enter a response.");
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
        setAnswer("");
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`);
      }
    } catch {
      setError("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.question}>{question}</h1>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
        style={styles.input}
      />
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.buttonContainer}>
        <button style={styles.nextButton} onClick={handleNext} disabled={loading}>
          {loading ? "Loading..." : "Next"}
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
  question: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "20px",
  },
  input: {
    width: "350px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "2px solid #ccc",
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
