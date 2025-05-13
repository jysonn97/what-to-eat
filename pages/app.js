import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import NavigationButtons from "@/components/NavigationButtons";
import CuisineGrid from "@/components/CuisineGrid";

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize answers from query (e.g. multi.js -> app.js)
  useEffect(() => {
    const init = [];

    if (location) {
      init.push({ key: "location", answer: location });
    }

    if (encodedAnswers) {
      try {
        const parsed = JSON.parse(encodedAnswers);
        init.push(...parsed);
      } catch (err) {
        console.error("Failed to parse answers from query", err);
      }
    }

    if (init.length > 0) {
      setAnswers(init);
      fetchNextQuestion(init);
    }
  }, [location, encodedAnswers]);

  const fetchNextQuestion = async (currentAnswers) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: currentAnswers }),
      });
      const data = await res.json();

      if (data?.nextQuestion) {
        setQuestionData(data.nextQuestion);
        setSelected([]);
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(currentAnswers))}`);
      }
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selected.length || !questionData?.key) return;

    const answer = questionData.key === "specialFeatures" || questionData.key === "cuisine"
      ? selected
      : selected[0];

    const updatedAnswers = [...answers, { key: questionData.key, answer }];

    // Auto-answer logic
    if (questionData.key === "occasion" && selected.includes("Business meeting")) {
      updatedAnswers.push({ key: "whoWith", answer: "Client / Coworkers" });
    }

    setAnswers(updatedAnswers);
    fetchNextQuestion(updatedAnswers);
  };

  const handleBack = () => {
    if (answers.length <= 1) {
      const params = new URLSearchParams({
        location: location || "",
        answers: JSON.stringify(answers.slice(1)) // exclude location
      });
      router.push(`/multi?${params.toString()}`);
      return;
    }

    const updated = [...answers];
    updated.pop();
    setAnswers(updated);
    fetchNextQuestion(updated);
  };

  const handleOptionToggle = (option) => {
    if (questionData.key === "specialFeatures") {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev.filter((o) => o !== "None"), option]
      );
    } else if (questionData.key === "cuisine") {
      setSelected(option); // already an array in cuisine grid
    } else {
      setSelected([option]);
    }
  };

  if (!questionData) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p className="text-sm opacity-50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 text-white font-extralight transition-colors duration-300">
      <div className="w-full max-w-xl space-y-8">
        <QuestionCard question={questionData.question} />

        {questionData.key === "cuisine" ? (
          <CuisineGrid selected={selected} onToggle={setSelected} />
        ) : (
          <div className="flex flex-col gap-3">
            {questionData.options.map((option) => (
              <OptionButton
                key={option}
                option={option}
                selected={selected}
                onClick={handleOptionToggle}
              />
            ))}
          </div>
        )}

        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          disabled={selected.length === 0}
          loading={loading}
        />

        <div className="pt-10 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-neutral-400 hover:text-white transition underline"
          >
            ⤺ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
