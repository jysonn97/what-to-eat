import CuisineGrid from "@/components/CuisineGrid";
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
    if (option === "None") {
      // If "None" is clicked → clear everything else and select only "None"
      setSelected(["None"]);
    } else {
      setSelected((prev) => {
        // Remove "None" if it was previously selected
        const filtered = prev.filter((o) => o !== "None");
        // Toggle the clicked option
        return filtered.includes(option)
          ? filtered.filter((o) => o !== option)
          : [...filtered, option];
      });
    }
  } else {
    setSelected([option]);
  }
};


  if (!questionData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 text-white font-extralight">
      <div className="w-full max-w-xl text-center space-y-8 pt-6">
        <QuestionCard question={questionData.question} />

{questionData.key === "cuisine" ? (
  <CuisineGrid
    options={questionData.options}
    selected={selected}
    onToggle={handleOptionToggle}
  />
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

        <div className="pt-6 flex justify-center">
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
