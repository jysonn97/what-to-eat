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
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-xl">
        {questionData && (
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
            {questionData.question}
          </h1>
        )}
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4">
          {questionData?.options?.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleOptionClick(option)}
            >
              <span className="text-base">{option}</span>
              <input
                type="radio"
                name="option"
                className="accent-black"
                readOnly
              />
            </label>
          ))}
        </div>

        {loading && <p className="mt-4 text-gray-600 text-center">⏳ Loading next question...</p>}
      </div>
    </div>
  );
}
