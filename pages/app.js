import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/QuestionScreen.module.css";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location) return;

    const initialAnswers = [{ key: "location", answer: location }];
    setAnswers(initialAnswers);
    fetchNextQuestion(initialAnswers);
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
        setQuestionData(data.nextQuestion);
      } else {
        router.push(
          `/recommendation?answers=${encodeURIComponent(
            JSON.stringify(currentAnswers)
          )}`
        );
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

    const updatedAnswers = [
      ...answers,
      { key: questionData.key, answer: selectedAnswer },
    ];
    setAnswers(updatedAnswers);
    fetchNextQuestion(updatedAnswers);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {questionData && <h1 className={styles.question}>{questionData.question}</h1>}

        <div className={styles.options}>
          {questionData?.options?.map((option, idx) => (
            <button
              key={idx}
              className={styles.optionButton}
              onClick={() => handleOptionClick(option)}
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {loading && <p className={styles.loading}>⏳ Loading next question...</p>}
      </div>
    </div>
  );
}
