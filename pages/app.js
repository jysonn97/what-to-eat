import { useState } from "react";
import { useRouter } from "next/router";

const question = {
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
};

const weightLabels = ["Not a big deal", "Matters a bit", "Super important"];

export default function AppPage() {
  const router = useRouter();

  const [selected, setSelected] = useState([]);
  const [weight, setWeight] = useState(1); // default: middle

  const handleOptionToggle = (option) => {
    setSelected([option]);
  };

  const handleNext = () => {
    const result = {
      key: question.key,
      answer: selected[0],
      weight: weightLabels[weight]
    };
    console.log("🧠 Final answer:", result);
    alert(`Logged to console:\n${JSON.stringify(result, null, 2)}`);
    // router.push("/recommendation") or next step...
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12 flex items-center justify-center font-extralight">
      <div className="w-full max-w-xl space-y-8">

        <h1 className="text-xl font-semibold">{question.question}</h1>

        <div className="flex flex-col gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionToggle(option)}
              className={`px-4 py-2 border rounded-md transition text-sm text-left ${
                selected.includes(option)
                  ? "bg-white text-black"
                  : "border-white text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="pt-2">
            <label className="block text-xs text-gray-300 mb-1">
              How much does this matter to you?
            </label>
            <div className="flex justify-between text-[11px] text-gray-400 mb-1 px-1">
              {weightLabels.map((label, i) => (
                <span key={i} className={i === weight ? "text-white font-medium" : ""}>
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
        )}

        {selected.length > 0 && (
          <div className="pt-6">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-white text-black rounded hover:opacity-90 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
