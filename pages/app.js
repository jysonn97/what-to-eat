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

const weightLabels = ["Not a big deal", "Matters a bit", "Super important"];

export default function AppPage() {
  const router = useRouter();
  const { location, answers: encodedAnswers } = router.query;

  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [weight, setWeight] = useState(1); // 0, 1, 2

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
        weight: weightLabels[weight] // "Not a big deal" | "Matters a bit" | "Super important"
      }
    ];

    setAnswers(updatedAnswers);

    if (step + 1 < staticQuestions.length) {
      setStep(step + 1);
      setSelected([]);
      setWeight(1); // reset weight to default
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

        {/* Weight Slider */}
        <div className="pt-2">
          <label className="block text-xs text-gray-300 mb-1">
            How much does this matter to you?
          </label>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1 px-1">
            {weightLabels.map((label, i) => (
              <span key={i} className={i === weight ? "text-white font-semibold" : ""}>
                {label}
              </span>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="2"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full accent-white"
          />
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
