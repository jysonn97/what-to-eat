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
    if (!selected || selected.length === 0 || !questionData?.key) return;

    let answerToSave = selected;
    const isMulti = questionData.key === "specialFeatures";
    if (!isMulti) {
      answerToSave = selected[0];
    }

    const updatedAnswers = [...answers, { key: questionData.key, answer: answerToSave }];

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
    const isMulti = questionData.key === "specialFeatures";

    if (isMulti) {
      setSelected((prev) => {
        if (option === "None") return ["None"];
        const filtered = prev.filter((o) => o !== "None");
        return filtered.includes(option)
          ? filtered.filter((o) => o !== option)
          : [...filtered, option];
      });
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

  if (!questionData) return null;
  if (shouldHideQuestion()) {
    handleNext();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-xl bg-gray-50 shadow-md rounded-2xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">{questionData.question}</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-3">
          {questionData.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionToggle(option)}
              className={`w-full px-4 py-3 rounded-lg border text-left transition-all duration-150 
                ${
                  selected.includes(option)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-300 hover:border-black"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            ← Go Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected.length || loading}
            className={`px-5 py-2 text-sm rounded-lg font-medium transition duration-150 
              ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
          >
            {loading ? "Loading..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
