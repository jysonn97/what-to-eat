import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import NavigationButtons from "@/components/NavigationButtons";

const staticQuestions = [
  {
    key: "occasion",
    question: "What’s the occasion?",
    options: [
      "Regular meal",
      "Date",
      "Business meeting",
      "Special event",
      "Traveling"
    ]
  },
  {
    key: "vibe",
    question: "What kind of vibe are you looking for?",
    options: [
      "Cozy",
      "Trendy",
      "Quiet",
      "Lively",
      "Scenic",
      "Minimalist",
      "Fancy"
    ]
  },
  {
    key: "time",
    question: "What time are you planning to eat?",
    options: ["Morning", "Lunch", "Dinner", "Late night"]
  },
  {
    key: "duration",
    question: "How long do you want to stay?",
    options: ["Quick meal", "About an hour", "Take your time"]
  }
];

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);

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

    setAnswers(init);
  }, [location, encodedAnswers]);

  const currentQuestion = staticQuestions[step];

  const handleNext = () => {
    if (!selected.length || !currentQuestion?.key) return;
    const updatedAnswers = [
      ...answers.filter((a) => a.key !== currentQuestion.key),
      { key: currentQuestion.key, answer: selected[0] }
    ];
    setAnswers(updatedAnswers);
    if (step + 1 < staticQuestions.length) {
      setStep(step + 1);
      setSelected([]);
    } else {
      router.push(
        `/recommendation?answers=${encodeURIComponent(
          JSON.stringify(updatedAnswers)
        )}`
      );
    }
  };

  const handleBack = () => {
    if (step === 0) {
      const params = new URLSearchParams({
        location: location || "",
        answers: JSON.stringify(answers.slice(1))
      });
      router.push(`/multi?${params.toString()}`);
    } else {
      setStep(step - 1);
      setSelected([]);
    }
  };

  const handleOptionToggle = (option) => {
    setSelected([option]);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 text-white font-extralight transition-colors duration-300">
      <div className="w-full max-w-xl space-y-8">
        <QuestionCard question={currentQuestion.question} />

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option) => (
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
          loading={false}
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
