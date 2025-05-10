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
    <div className="min-h-screen bg-black text-white font-extralight px-4 py-10">
      <div className="max-w-xl mx-auto space-y-10 text-left">
        {/* Price */}
        <div className="space-y-3">
          <p className="text-base font-bold text-white">Price</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {priceOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedPrice, setSelectedPrice)}
                className={`px-3 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
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
        <div className="space-y-3">
          <p className="text-base font-bold text-white">Rating</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {ratingOptions.map((r) => (
              <button
                key={r}
                onClick={() => toggle(r, selectedRating, setSelectedRating)}
                className={`px-3 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
                  selectedRating === r ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600" />

        {/* Cuisine */}
        <div className="space-y-3">
          <p className="text-base font-bold text-white">Cuisine</p>
          <CuisineGrid selected={selectedCuisine} onToggle={setSelectedCuisine} small={true} />
        </div>

        <hr className="border-gray-600" />

        {/* Party size */}
        <div className="space-y-3">
          <p className="text-base font-bold text-white">Party Size</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {partyOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedParty, setSelectedParty)}
                className={`px-3 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
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
<div className="space-y-3">
  <p className="text-base font-bold text-white">Additional Features</p>
  <div className="flex flex-wrap gap-2 justify-start">
    {[...featureOptions, "None"].map((f) => (
      <button
        key={f}
        onClick={() => toggleFeature(f)}
className={`px-3 py-1 text-xs rounded-md border transition min-w-[120px] text-center ${
  selectedFeatures.includes(f) ? "bg-white text-black" : "border-white text-white"
}`}

      >
        {f}
      </button>
    ))}
  </div>
</div>

{/* Buttons */}
<div className="pt-6 flex flex-col items-center gap-[7px]">
  <button
    onClick={clearAll}
    className="text-xs underline text-white font-light hover:opacity-90 mt-7"
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
