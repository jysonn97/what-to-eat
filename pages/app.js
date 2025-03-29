import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location && answers.length === 0) {
      const initialAnswers = [{ key: "location", answer: location }];
      setAnswers(initialAnswers);
      fetchNextQuestion(initialAnswers);
    }
    if (!location && answers.length === 0) {
      fetchNextQuestion([]);
    }
  }, [location, answers.length]);

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
      if (data.nextQuestion) {
        setQuestionData(data.nextQuestion);
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(currentAnswers))}`);
      }
    } catch (err) {
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
      <div style={styles.card}>
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

        {loading && <p style={styles.loading}>⏳ Loading...</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px 30px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "24px",
    fontWeight: 600,
    color: "#333",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  optionButton: {
    padding: "12px 20px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "0.2s",
  },
  loading: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#888",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};
