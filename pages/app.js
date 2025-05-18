import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import NavigationButtons from "@/components/NavigationButtons";

const staticQuestions = [
  {
    key: "vibe",
    question: "What’s the vibe or occasion today?",
    options: [
      "Low-key date spot",
      "Just a chill meal",
      "Celebrating something",
      "Exploring while traveling",
      "Business-y meal",
      "Anywhere’s fine, really",
      "Quick bite, nothing fancy"
    ],
    hasWeight: false
  },
  {
    key: "distance",
    question: "How far are you willing to go?",
    options: [
      "Walking distance (~10 mins)",
      "Around 20 mins is fine",
      "I’m okay going further (30+ mins)"
    ],
    hasWeight: true
  },
  {
    key: "ratingImportance",
    question: "How important are good reviews to you?",
    options: [
      "4.5+ only, I want the best",
      "4.0+ is good enough",
      "3.5+ is fine",
      "I don’t care about ratings"
    ],
    hasWeight: true
  },
  {
    key: "avoid",
    question: "Anything you’d rather avoid today?",
    options: [
      "Loud or noisy places",
      "Cramped/tightly packed spaces",
      "Bad or rude service",
      "Long wait times",
      "Nothing in particular"
    ],
    hasWeight: true
  }
];

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [weights, setWeights] = useState({});
  const currentQuestion = staticQuestions[step];

  useEffect(() => {
    const init = [];
    if (location) init.push({ key: "location", answer: location });
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

  const handleNext = () => {
    if (selected.length === 0) return;

    const answer = currentQuestion.key === "avoid" ? selected : selected[0];
    const payload = currentQuestion.hasWeight
      ? { key: currentQuestion.key, answer, weight: weights }
      : { key: currentQuestion.key, answer };

    const updatedAnswers = [
      ...answers.filter((a) => a.key !== currentQuestion.key),
      payload
    ];

    if (step + 1 < staticQuestions.length) {
      setAnswers(updatedAnswers);
      setStep(step + 1);
      setSelected([]);
      setWeights({});
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
      setWeights({});
    }
  };

  const toggleOption = (option) => {
    if (currentQuestion.key === "avoid") {
      if (option === "Nothing in particular") {
        setSelected(["Nothing in particular"]);
        setWeights({});
      } else {
        const updated = selected.includes(option)
          ? selected.filter((o) => o !== option)
          : [...selected.filter((o) => o !== "Nothing in particular"), option];
        setSelected(updated);
        if (!selected.includes(option)) {
          setWeights({ ...weights, [option]: 1 });
        } else {
          const copy = { ...weights };
          delete copy[option];
          setWeights(copy);
        }
      }
    } else {
      setSelected([option === selected[0] ? null : option].filter(Boolean));
    }
  };

  const updateWeight = (option, value) => {
    setWeights({ ...weights, [option]: value });
  };

  const renderAvoidOptions = () => (
    <div className="flex flex-col gap-3">
      {currentQuestion.options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <div
            key={option}
            className="flex items-center justify-between gap-3"
          >
            <button
              onClick={() => toggleOption(option)}
              className={`flex-1 px-4 py-2 border rounded transition text-sm text-left ${
                isSelected
                  ? "bg-white text-black border-white"
                  : "border-white text-white"
              }`}
            >
              {option}
            </button>
            {isSelected && option !== "Nothing in particular" && (
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={weights[option] || 1}
                onChange={(e) =>
                  updateWeight(option, parseInt(e.target.value))
                }
                className="w-28"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 text-white font-extralight">
      <div className="w-full max-w-xl space-y-8 text-center">
        <QuestionCard question={currentQuestion.question} />

        {currentQuestion.key === "avoid" ? (
          renderAvoidOptions()
        ) : (
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option}
                option={option}
                selected={selected}
                onClick={toggleOption}
              />
            ))}
          </div>
        )}

        <NavigationButtons
          onBack={handleBack}
          onNext={handleNext}
          disabled={selected.length === 0}
          loading={false}
        />

        <div className="pt-10">
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
