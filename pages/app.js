import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { questionFlow } from "../lib/questionFlow"; // ✅ Import our structured flow

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  const currentQuestion = questionFlow[currentStep];

  // Handles conditional question skipping
  useEffect(() => {
    const step = questionFlow[currentStep];
    if (step?.condition && !step.condition(answers)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, answers]);

  const handleOptionClick = (option) => {
    if (!option) {
      setError("⚠️ Please select an option.");
      return;
    }

    const newAnswers = [...answers, { id: currentQuestion.id, question: currentQuestion.question, answer: option }];
    setAnswers(newAnswers);
    setError("");

    const nextStep = currentStep + 1;
    if (nextStep >= questionFlow.length) {
      router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(newAnswers))}`);
    } else {
      setCurrentStep(nextStep);
    }
  };

  useEffect(() => {
    // Add location as first answer on first load
    if (location && answers.length === 0) {
      setAnswers([{ id: "location", question: "📍 Location", answer: location }]);
    }
  }, [location]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{currentQuestion?.question}</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.optionsContainer}>
        {currentQuestion?.options?.map((option, idx) => (
          <button
            key={idx}
            style={styles.optionButton}
            onClick={() => handleOptionClick(option)}
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
    marginBottom: "20px",
  },
  optionsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "12px",
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
