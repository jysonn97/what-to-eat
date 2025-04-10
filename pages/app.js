import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState(location ? [{ key: "location", answer: location }] : []);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchNextQuestion([{ key: "location", answer: location }]);
    }
  }, [location]);

  const fetchNextQuestion = async (currentAnswers) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: currentAnswers }),
      });
      const data = await res.json();

      if (data.nextQuestion) {
        setQuestionData(data.nextQuestion);
        setSelected(""); // Reset selection
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(currentAnswers))}`);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selected || !questionData?.key) return;
    const updated = [...answers, { key: questionData.key, answer: selected }];
    setAnswers(updated);
    fetchNextQuestion(updated);
  };

  const handleBack = () => {
    if (answers.length <= 1) {
      router.push("/location"); // ✅ Go back to location if at first question
      return;
    }
    const updated = [...answers];
    updated.pop(); // Remove last answer
    setAnswers(updated);
    fetchNextQuestion(updated);
  };

  return (
    <div style={styles.container}>
      {questionData && <h1 style={styles.title}>{questionData.question}</h1>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.options}>
        {questionData?.options?.map((option, index) => (
          <label key={index} style={styles.optionItem}>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              style={styles.radio}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={styles.buttons}>
        <button onClick={handleBack} style={styles.backButton}>← Go Back</button>
        <button onClick={handleNext} disabled={!selected || loading} style={styles.nextButton}>
          {loading ? "Loading..." : "Next →"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    backgroundColor: "#fff",
    color: "#1f1f1f",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(22px, 4vw, 36px)",
    marginBottom: "30px",
    fontWeight: 600,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
    maxWidth: "400px",
    alignItems: "flex-start",
  },
  optionItem: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  radio: {
    width: "18px",
    height: "18px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
  },
  nextButton: {
    padding: "10px 24px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
  },
  backButton: {
    padding: "10px 24px",
    backgroundColor: "#f1f1f1",
    color: "#000",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};
