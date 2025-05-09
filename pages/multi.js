import { useState } from "react";
import { useRouter } from "next/router";
import CuisineGrid from "@/components/CuisineGrid";
import OptionButton from "@/components/OptionButton";

export default function MultiPage() {
  const router = useRouter();

  const [cuisine, setCuisine] = useState([]);
  const [budget, setBudget] = useState("");
  const [partySize, setPartySize] = useState("");
  const [occasion, setOccasion] = useState("");

  const isComplete = cuisine.length && budget && partySize && occasion;

  const handleNext = () => {
    const answers = [
      { key: "cuisine", answer: cuisine },
      { key: "budget", answer: budget },
      { key: "partySize", answer: partySize },
      { key: "occasion", answer: occasion }
    ];
    router.push(`/app?initialAnswers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-extralight flex justify-center items-center">
      <div className="w-full max-w-xl space-y-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extralight tracking-tight leading-tight">
          Tell us a bit about your meal
        </h1>

        {/* Cuisine */}
        <div className="space-y-3">
          <h2 className="text-sm text-neutral-400 uppercase tracking-wide">Cuisine</h2>
          <CuisineGrid selected={cuisine} onToggle={setCuisine} />
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <h2 className="text-sm text-neutral-400 uppercase tracking-wide">Budget</h2>
          <div className="flex justify-center gap-2">
            {["$", "$$", "$$$"].map((b) => (
              <OptionButton key={b} option={b} selected={[budget]} onClick={() => setBudget(b)} />
            ))}
          </div>
        </div>

        {/* Party Size */}
        <div className="space-y-3">
          <h2 className="text-sm text-neutral-400 uppercase tracking-wide">Party Size</h2>
          <div className="flex justify-center gap-2">
            {["1", "2", "3–4", "5+"].map((size) => (
              <OptionButton key={size} option={size} selected={[partySize]} onClick={() => setPartySize(size)} />
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div className="space-y-3">
          <h2 className="text-sm text-neutral-400 uppercase tracking-wide">Occasion</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {["Regular", "Date", "Work", "Special"].map((o) => (
              <OptionButton key={o} option={o} selected={[occasion]} onClick={() => setOccasion(o)} />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!isComplete}
          className={`mt-8 px-6 py-2.5 text-sm rounded-sm transition ${
            isComplete
              ? "bg-white text-black hover:opacity-90"
              : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
