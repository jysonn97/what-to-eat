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
        const weight = weights[option] ?? 1;

        return (
          <div
            key={option}
            className="flex items-center justify-between gap-3 border border-neutral-700 rounded-lg px-3 py-2 hover:border-neutral-500 transition"
          >
            <button
              onClick={() => toggleOption(option)}
              className={`flex-1 text-left text-sm transition-colors duration-150 ${
                isSelected ? "text-white" : "text-neutral-400"
              }`}
            >
              {option}
            </button>

            {isSelected && option !== "Nothing in particular" && (
              <div className="flex flex-col items-end w-28 text-xs text-neutral-400">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={weight}
                  onChange={(e) =>
                    updateWeight(option, parseInt(e.target.value))
                  }
                  className="w-full h-1 rounded bg-neutral-600 appearance-none"
                />
                <span className="mt-1">
                  {["Not a big deal", "Matters a bit", "Really matters"][weight]}
                </span>
              </div>
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

            {currentQuestion.hasWeight &&
              selected.length > 0 &&
              selected[0] !== "I don’t care about ratings" && (
                <div className="flex flex-col items-center pt-4">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={weights[selected[0]] ?? 1}
                    onChange={(e) =>
                      updateWeight(selected[0], parseInt(e.target.value))
                    }
                    className="w-2/3 h-1 rounded bg-neutral-600 appearance-none"
                  />
                  <div className="text-xs text-neutral-400 mt-1">
                    {
                      ["Not a big deal", "Matters a bit", "Really matters"][
                        weights[selected[0]] ?? 1
                      ]
                    }
                  </div>
                </div>
              )}
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
