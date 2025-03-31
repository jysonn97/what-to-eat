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
      const initial = [{ key: "location", answer: location }];
      setAnswers(initial);
      fetchNextQuestion(initial);
    } else if (!location && answers.length === 0) {
      fetchNextQuestion([]);
    }
  }, [location, answers.length]);

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

  const handleOptionClick = (selectedAnswer) => {
    if (!questionData?.key) return;
    const updatedAnswers = [...answers, { key: questionData.key, answer: selectedAnswer }];
    setAnswers(updatedAnswers);
    fetchNextQuestion(updatedAnswers);
  };

  return (
    <div className="app-container">
      <div className="question-box">
        {questionData && (
          <h1 className="question-title">🍽️ {questionData.question}</h1>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="options-stack">
          {questionData?.options?.map((option, idx) => (
            <button
              key={idx}
              className="option-button"
              onClick={() => handleOptionClick(option)}
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>

        {loading && <p className="loading-text">⏳ Loading...</p>}
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f8f8;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .question-box {
          background: #fff;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
          width: 100%;
          max-width: 600px;
        }

        .question-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .option-button {
          padding: 14px 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .option-button:hover {
          background-color: #f0f0f0;
        }

        .error-text {
          color: red;
          text-align: center;
          font-weight: 500;
          margin-top: 10px;
        }

        .loading-text {
          margin-top: 20px;
          text-align: center;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}
