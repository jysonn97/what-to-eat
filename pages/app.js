import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import NavigationButtons from "@/components/NavigationButtons";

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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <QuestionCard question={questionData.question} />

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="space-y-3">
          {questionData.options?.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              selected={selected}
              onClick={handleOptionToggle}
            />
          ))}
        </div>

        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          disabled={!selected.length}
          loading={loading}
        />
      </div>
    </div>
  );
}
