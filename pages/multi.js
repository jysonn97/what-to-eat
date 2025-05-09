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
  "Accepts reservations",
  "Delivery available",
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
    setSelectedFeatures((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
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
    <div className="min-h-screen bg-black text-white font-extralight px-6 py-12">
      <div className="max-w-xl mx-auto space-y-8 text-left">
        {/* Price */}
        <div>
          <p className="text-sm font-semibold mb-2 text-white">Price</p>
          <div className="flex flex-wrap gap-2">
            {priceOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedPrice, setSelectedPrice)}
                className={`px-4 py-1.5 text-sm rounded-md border transition ${
                  selectedPrice === p ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <p className="text-sm font-semibold mb-2 text-white">Rating</p>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((r) => (
              <button
                key={r}
                onClick={() => toggle(r, selectedRating, setSelectedRating)}
                className={`px-4 py-1.5 text-sm rounded-md border transition ${
                  selectedRating === r ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <p className="text-sm font-semibold mb-2 text-white">Cuisine</p>
          <CuisineGrid selected={selectedCuisine} onToggle={setSelectedCuisine} />
        </div>

        {/* Party size */}
        <div>
          <p className="text-sm font-semibold mb-2 text-white">Party Size</p>
          <div className="flex flex-wrap gap-2">
            {partyOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedParty, setSelectedParty)}
                className={`px-4 py-1.5 text-sm rounded-md border transition ${
                  selectedParty === p ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-sm font-semibold mb-2 text-white">More Filters</p>
          <div className="flex flex-wrap gap-2">
            {featureOptions.map((f) => (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-4 py-1.5 text-sm rounded-md border transition ${
                  selectedFeatures.includes(f) ? "bg-white text-black" : "border-white text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 text-sm bg-white text-black rounded hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
