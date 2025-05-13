import { useRouter } from "next/router";
import { useState } from "react";
import CuisineGrid from "@/components/CuisineGrid";

const priceOptions = ["$", "$$", "$$$", "$$$$", "Doesn’t matter"];
const ratingOptions = ["3.5+", "4.0+", "4.5+", "Doesn’t matter"];
const partyOptions = ["Just me", "2", "3–4", "5+"];
const featureOptions = [
  "Outdoor seating",
  "Vegetarian options",
  "Pet-friendly",
  "Late-night open",
  "Good for groups",
  "Wheelchair accessible",
];

export default function MultiQuestionPage() {
  const router = useRouter();
  const { location } = router.query;

  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const toggle = (value, current, set) => {
    if (value === "Doesn’t matter") {
      set("Doesn’t matter");
    } else if (current === "Doesn’t matter") {
      set(value);
    } else {
      set(value === current ? "" : value);
    }
  };

  const toggleFeature = (item) => {
    if (item === "None") {
      setSelectedFeatures(["None"]);
      return;
    }
    setSelectedFeatures((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev.filter((f) => f !== "None"), item]
    );
  };

  const clearAll = () => {
    setSelectedPrice("");
    setSelectedRating("");
    setSelectedCuisine([]);
    setSelectedParty("");
    setSelectedFeatures([]);
  };

  const handleNext = () => {
    const answers = [
      { key: "location", answer: location },
      { key: "price", answer: selectedPrice || "Doesn’t matter" },
      { key: "rating", answer: selectedRating || "Doesn’t matter" },
      { key: "cuisine", answer: selectedCuisine.length > 0 ? selectedCuisine : ["Open to anything"] },
      { key: "partySize", answer: selectedParty },
      { key: "specialFeatures", answer: selectedFeatures },
    ];
    router.push(`/app?location=${encodeURIComponent(location)}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-extralight px-3 py-8 text-xs">
      <div className="max-w-xl mx-auto space-y-8 text-left">

        {/* Home Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={() => router.push("/")}
            className="text-xs underline text-white hover:opacity-90"
          >
            Home
          </button>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-[15px] font-bold text-white">Price</p>
            <button
              onClick={() => alert("💸 Helps us find spots that match your budget.")}
              className="text-xs bg-white text-black rounded-full w-4 h-4 text-center font-bold leading-3 hover:opacity-80"
              title="More info"
            >
              ?
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {priceOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedPrice, setSelectedPrice)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
                  selectedPrice === p ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600" />

        {/* Rating */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-[15px] font-bold text-white">Rating</p>
            <button
              onClick={() => alert("⭐ Choose the minimum review score you're okay with.")}
              className="text-xs bg-white text-black rounded-full w-4 h-4 text-center font-bold leading-3 hover:opacity-80"
              title="More info"
            >
              ?
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {ratingOptions.map((r) => (
              <button
                key={r}
                onClick={() => toggle(r, selectedRating, setSelectedRating)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
                  selectedRating === r ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600" />

        {/* Craving */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-[15px] font-bold text-white">Craving</p>
            <button
              onClick={() => alert("🍕 Choose what kind of food you're in the mood for.")}
              className="text-xs bg-white text-black rounded-full w-4 h-4 text-center font-bold leading-3 hover:opacity-80"
              title="More info"
            >
              ?
            </button>
          </div>
          <CuisineGrid selected={selectedCuisine} onToggle={setSelectedCuisine} small={true} />
        </div>

        <hr className="border-gray-600" />

        {/* Party Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-[15px] font-bold text-white">Party Size</p>
            <button
              onClick={() => alert("👥 Helps us find spots that work for your group size.")}
              className="text-xs bg-white text-black rounded-full w-4 h-4 text-center font-bold leading-3 hover:opacity-80"
              title="More info"
            >
              ?
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {partyOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedParty, setSelectedParty)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
                  selectedParty === p ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600" />

        {/* Additional Features */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <p className="text-[15px] font-bold text-white">Additional Features</p>
            <button
              onClick={() => alert("🎯 Filter based on extras like outdoor seating or pet-friendliness.")}
              className="text-xs bg-white text-black rounded-full w-4 h-4 text-center font-bold leading-3 hover:opacity-80"
              title="More info"
            >
              ?
            </button>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {[...featureOptions, "None"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[120px] text-center ${
                  selectedFeatures.includes(f) ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 flex flex-col items-center gap-[6px]">
          <button
            onClick={clearAll}
            className="text-xs underline text-white font-light hover:opacity-90 -mt-5"
          >
            Clear All
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 text-[12px] bg-white text-black rounded hover:opacity-90 transition"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
