import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuestionCard from "@/components/QuestionCard";

const staticQuestions = [
  {
    key: "occasion",
    question: "What’s the occasion?",
    options: [
      "Regular meal",
      "Date",
      "Business meeting",
      "Special event",
      "Traveling",
      "Any"
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
      "Fancy",
      "Any"
    ]
  },
  {
    key: "time",
    question: "What time are you planning to eat?",
    options: ["Morning", "Lunch", "Dinner", "Late night", "Any"]
  },
  {
    key: "duration",
    question: "How long do you want to stay?",
    options: ["Quick meal", "About an hour", "Take your time", "Any"]
  }
];

const weightLabels = ["Not a big deal", "Matters a bit", "Really matters"];

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [weight, setWeight] = useState(1);

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
      {
        key: currentQuestion.key,
        answer: selected[0],
        weight: selected[0] === "Any" ? "Not specified" : weightLabels[weight]
      }
    ];

    setAnswers(updatedAnswers);

    if (step + 1 < staticQuestions.length) {
      setStep(step + 1);
      setSelected([]);
      setWeight(1);
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
      setWeight(1);
    }
  };

  const handleOptionToggle = (option) => {
    setSelected((prev) =>
      prev.includes(option) ? [] : [option]
    );
  };

  const handleWeightLabelClick = (index) => {
    setWeight(index);
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 flex items-center justify-center font-extralight">
      <div className="w-full max-w-xl space-y-8 text-center">

        <QuestionCard question={currentQuestion.question} />

        <div className="flex flex-col gap-2 items-center">
          {currentQuestion.options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleOptionToggle(option)}
                className={`w-52 px-3 py-1.5 text-sm rounded-md border transition font-light ${
                  isSelected
                    ? "bg-white text-black border-white"
                    : "border-white text-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

{selected.length > 0 && selected[0] !== "Any" && (
  <div className="pt-4">
    <label className="block text-[15px] text-white mb-2 font-light">
      How much does this matter to you?
    </label>


            <div className="flex justify-between text-sm text-gray-400 mb-1 px-1 cursor-pointer">
              {weightLabels.map((label, i) => (
                <span
                  key={i}
                  onClick={() => handleWeightLabelClick(i)}
                  className={`transition ${
                    i === weight ? "text-white font-medium" : "hover:text-white"
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
                className="w-2/3 accent-white"
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
