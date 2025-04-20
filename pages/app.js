import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState(location ? [{ key: "location", answer: location }] : []);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState([]);
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
        setSelected([]);
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
    if (!selected.length || !questionData?.key) return;

    let answerToSave = selected;
    if (!questionData.multi) {
      answerToSave = selected[0];
    }

    const updatedAnswers = [...answers, { key: questionData.key, answer: answerToSave }];

    // Auto-fill whoWith if occasion is Business meeting
    const isOccasionBusiness = questionData.key === "occasion" && selected.includes("Business meeting");
    if (isOccasionBusiness) {
      updatedAnswers.push({ key: "whoWith", answer: "Client / Coworkers" });
    }

    fetchNextQuestion(updatedAnswers);
    setAnswers(updatedAnswers);
  };

  const handleBack = () => {
    if (answers.length <= 1) {
      router.push("/location");
      return;
    }
    const updated = [...answers];
    updated.pop();
    setAnswers(updated);
    fetchNextQuestion(updated);
  };

  const handleOptionToggle = (option) => {
    if (questionData.multi) {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    } else {
      setSelected([option]);
    }
  };

  const shouldHideQuestion = () => {
    const lastOccasion = answers.find((a) => a.key === "occasion")?.answer;
    const whoWithAnswer = answers.find((a) => a.key === "whoWith")?.answer;

    if (questionData.key === "whoWith" && lastOccasion === "Business meeting") return true;
    if (questionData.key === "partySize" && whoWithAnswer === "Alone") return true;

    return false;
  };

  if (shouldHideQuestion()) {
    handleNext();
    return null;
  }

  return (
    <div style={styles.container}>
      {questionData && <h1 style={styles.title}>{questionData.question}</h1>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.options}>
        {questionData?.options?.map((option, index) => (
          <label key={index} style={styles.optionItem}>
            <input
              type={questionData.multi ? "checkbox" : "radio"}
              name="answer"
              value={option}
              checked={selected.includes(option)}
              onChange={() => handleOptionToggle(option)}
              style={styles.radio}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={styles.buttons}>
        <button onClick={handleBack} style={styles.backButton}>← Go Back</button>
        <button onClick={handleNext} disabled={!selected.length || loading} style={styles.nextButton}>
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
    padding: "40px 20px",
    backgroundColor: "#fff",
    color: "#1f1f1f",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 600,
    marginBottom: "40px",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
    alignItems: "flex-start",
    marginBottom: "40px",
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
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  nextButton: {
    padding: "10px 26px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 26px",
    backgroundColor: "#f1f1f1",
    color: "#000",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};
