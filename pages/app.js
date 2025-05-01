import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import NavigationButtons from "@/components/NavigationButtons";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      const initial = [{ key: "location", answer: location }];
      setAnswers(initial);
      fetchNextQuestion(initial);
    }
  }, [location]);

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

    const answer = questionData.key === "specialFeatures" ? selected : selected[0];
    const updatedAnswers = [...answers, { key: questionData.key, answer }];

    if (questionData.key === "occasion" && selected.includes("Business meeting")) {
      updatedAnswers.push({ key: "whoWith", answer: "Client / Coworkers" });
    }

    setAnswers(updatedAnswers);
    fetchNextQuestion(updatedAnswers);
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
    if (questionData.key === "specialFeatures") {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev.filter((o) => o !== "None"), option]
      );
    } else {
      setSelected([option]);
    }
  };

  if (!questionData) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 text-white font-extralight">
      <div className="w-full max-w-xl text-center space-y-10">
        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight text-white">
          {questionData.question}
        </h1>

        <div className="flex flex-col gap-3 text-left">
          {questionData.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={selected}
              onClick={handleOptionToggle}
            />
          ))}
        </div>

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
