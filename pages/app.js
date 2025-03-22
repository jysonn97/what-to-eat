import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState(location ? [{ key: "location", answer: location }] : []);
  const [questionData, setQuestionData] = useState(null); // Stores { key, question, options }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchNextQuestion(answers);
    }
  }, [location]);

  const fetchNextQuestion = async (currentAnswers) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: currentAnswers }),
      });

      const data = await response.json();
      console.log("🧠 API Response:", data);

      if (data.nextQuestion) {
        setQuestionData(data.nextQuestion); // { key, question, options }
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(currentAnswers))}`);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (selectedAnswer) => {
    if (!questionData?.key) return;
    const updatedAnswers = [...answers, { key: questionData.key, answer: selectedAnswer }];
    setAnswers(updatedAnswers);
    fetchNextQuestion(updatedAnswers);
  };

  return (
    <div style={styles.container}>
      {questionData && <h1 style={styles.title}>{questionData.question}</h1>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.optionsContainer}>
        {questionData?.options?.map((option, idx) => (
          <button
            key={idx}
            style={styles.optionButton}
            onClick={() => handleOptionClick(option)}
            disabled={loading}
          >
            {option}
          </button>
        ))}
      </div>

      {loading && <p>⏳ Loading next question...</p>}
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
    fontFamily: "Aptos, sans-serif",
    textAlign: "center",
    padding: "0 20px",
    backgroundColor: "#fff",
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
    marginTop: "10px",
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
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
  },
};
