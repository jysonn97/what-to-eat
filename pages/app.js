import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";

const weightLabels = ["Not a big deal", "Matters a bit", "Really matters"];

const questionSet = (showQuickBite) => [
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
      ...(showQuickBite ? ["Quick bite, nothing fancy"] : [])
    ],
    multi: false,
    showWeight: false
  },
  {
    key: "distance",
    question: "How far are you willing to go?",
    options: [
      "Walking distance (~10 mins)",
      "Around 20 mins is fine",
      "I’m okay going further (30+ mins)"
    ],
    multi: false,
    showWeight: true
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
    multi: false,
    showWeight: true,
    hideWeightOn: "I don’t care about ratings"
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
    multi: true,
    showWeight: true,
    hideWeightOn: "Nothing in particular"
  }
];

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [weight, setWeight] = useState(1);
  const [weights, setWeights] = useState({});
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (encodedAnswers) {
      try {
        const parsed = JSON.parse(encodedAnswers);
        setAnswers(parsed);
        const priceAnswer = parsed.find((a) => a.key === "price");
        if (priceAnswer) setBudget(priceAnswer.answer);
      } catch (err) {
        console.error("Error parsing answers", err);
      }
    }
  }, [encodedAnswers]);

  const questions = questionSet(budget === "$");
  const current = questions[step];

  const handleNext = () => {
    if (!selected.length && !current.multi) return;

    const finalAnswer = {
      key: current.key,
      answer: current.multi ? selected : selected[0],
      weight:
        !current.showWeight ||
        selected.includes(current.hideWeightOn) ||
        selected[0] === current.hideWeightOn
          ? "Not specified"
          : current.multi
          ? weights
          : weightLabels[weight]
    };

    const updated = [...answers.filter((a) => a.key !== current.key), finalAnswer];
    setAnswers(updated);

    if (step + 1 < questions.length) {
      setStep(step + 1);
      setSelected([]);
      setWeight(1);
      setWeights({});
    } else {
      router.push(
        `/recommendation?answers=${encodeURIComponent(JSON.stringify(updated))}`
      );
    }
  };

  const handleBack = () => {
    if (step === 0) {
      const params = new URLSearchParams({
        location: location || "",
        answers: JSON.stringify(answers)
      });
      router.push(`/multi?${params.toString()}`);
    } else {
      setStep(step - 1);
      setSelected([]);
      setWeight(1);
      setWeights({});
    }
  };

  const toggle = (option) => {
    if (current.multi) {
      setSelected((prev) => {
        if (option === current.hideWeightOn) return [option];
        const withoutHideOption = prev.filter((o) => o !== current.hideWeightOn);
        return prev.includes(option)
          ? withoutHideOption.filter((o) => o !== option)
          : [...withoutHideOption, option];
      });
    } else {
      setSelected((prev) => (prev[0] === option ? [] : [option]));
    }
  };

  const isWeightVisible = () => {
    if (!current.showWeight) return false;
    if (!selected.length) return false;
    return !selected.includes(current.hideWeightOn);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 flex items-center justify-center font-extralight">
      <div className="w-full max-w-xl space-y-10 text-center">
        <QuestionCard question={current.question} />

        <div className="grid grid-cols-1 gap-3 place-items-center">
          {current.options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <div
                key={option}
                className="flex items-center justify-between w-72"
              >
                <button
                  onClick={() => toggle(option)}
                  className={`flex-1 px-4 py-2 rounded-md border text-sm text-left transition-all duration-200 font-light ${
                    isSelected
                      ? "bg-white text-black border-white scale-[1.02]"
                      : "border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {option}
                </button>

                {current.multi &&
                  isSelected &&
                  option !== current.hideWeightOn && (
                    <div className="flex flex-col items-end ml-3 w-[90px]">
                      <div className="flex justify-between w-full text-[10px] text-neutral-400 mb-1 cursor-pointer">
                        {weightLabels.map((label, i) => (
                          <span
                            key={i}
                            onClick={() =>
                              setWeights((prev) => ({ ...prev, [option]: i }))
                            }
                            className={`${
                              i === (weights[option] ?? 1)
                                ? "text-white font-medium"
                                : "hover:text-white"
                            }`}
                          >
                            {i === 0 ? "Not" : i === 1 ? "Bit" : "Really"}
                          </span>
                        ))}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        value={weights[option] ?? 1}
                        onChange={(e) =>
                          setWeights((prev) => ({
                            ...prev,
                            [option]: parseInt(e.target.value)
                          }))
                        }
                        className="w-full h-[3px] rounded bg-neutral-600 accent-white"
                      />
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {isWeightVisible() && !current.multi && (
          <div className="pt-4">
            <label className="block text-[15px] text-white mb-2 font-light">
              How much does this matter to you?
            </label>
            <div className="flex justify-between text-sm text-gray-400 mb-1 px-1 cursor-pointer">
              {weightLabels.map((label, i) => (
                <span
                  key={i}
                  onClick={() => setWeight(i)}
                  className={`transition ${
                    i === weight ? "text-white font-medium scale-[1.05]" : "hover:text-white"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <input
                type="range"
                min="0"
                max="2"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-[60%] accent-white"
              />
            </div>
          </div>
        )}

        <div className="pt-3 flex flex-col gap-[10px] items-center">
          <button
            onClick={handleBack}
            className="text-xs text-neutral-400 hover:text-white transition underline"
          >
            ⤺ Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-white text-black rounded hover:opacity-90 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
