import { useRouter } from "next/router";
import { useState } from "react";
import CuisineGrid from "@/components/CuisineGrid";
import {
  Flame,
  Leaf,
  Drumstick,
  Bowl,
  Cookie,
  Utensils,
  IceCream,
  ChefHat,
  Soup,
  HandPlatter,
  Martini,
  Salad,
} from "lucide-react";

const priceOptions = ["$", "$$", "$$$", "$$$$", "Doesn’t matter"];
const featureOptions = [
  "Outdoor seating",
  "Vegetarian options",
  "Pet-friendly",
  "Late-night open",
  "Good for groups",
  "Wheelchair accessible"
];

export default function MultiQuestionPage() {
  const router = useRouter();
  const { location } = router.query;

  const [selectedPrice, setSelectedPrice] = useState("");
  const [useFlavorCraving, setUseFlavorCraving] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedCravingTags, setSelectedCravingTags] = useState([]);
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

  const toggleCravingTag = (tag) => {
    setSelectedCravingTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSelectedPrice("");
    setSelectedCuisine([]);
    setSelectedCravingTags([]);
    setSelectedFeatures([]);
    setUseFlavorCraving(false);
  };

  const handleNext = () => {
    if (
      !selectedPrice ||
      (!useFlavorCraving && selectedCuisine.length === 0) ||
      (useFlavorCraving && selectedCravingTags.length === 0) ||
      selectedFeatures.length === 0
    ) {
      alert("Please answer all the questions before proceeding.");
      return;
    }

    const answers = [
      { key: "location", answer: location },
      { key: "price", answer: selectedPrice },
      { key: "cravingType", answer: useFlavorCraving ? "flavor" : "cuisine" },
      {
        key: "cuisine",
        answer: useFlavorCraving ? selectedCravingTags : selectedCuisine
      },
      { key: "specialFeatures", answer: selectedFeatures }
    ];

    router.push(
      `/app?location=${encodeURIComponent(location)}&answers=${encodeURIComponent(
        JSON.stringify(answers)
      )}`
    );
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
          <p className="text-[15px] font-bold text-white">Budget</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {priceOptions.map((p) => (
              <button
                key={p}
                onClick={() => toggle(p, selectedPrice, setSelectedPrice)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[80px] text-center ${
                  selectedPrice === p
                    ? "bg-white text-black"
                    : "border-white text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600" />

        {/* Craving (Cuisine or Flavor) */}
        <div className="space-y-2">
          <p className="text-[15px] font-bold text-white">Craving</p>

          {!useFlavorCraving ? (
            <>
              <CuisineGrid selected={selectedCuisine} onToggle={setSelectedCuisine} small={true} />
              <div className="pt-2">
                <button
                  onClick={() => {
                    setUseFlavorCraving(true);
                    setSelectedCuisine([]);
                  }}
                  className="text-xs underline text-white hover:text-gray-200 transition"
                >
                  Not sure? Choose by flavor instead
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm pt-2">
                {[
                  { label: "Spicy", icon: Flame },
                  { label: "Something light", icon: Salad },
                  { label: "Savory & rich", icon: Drumstick },
                  { label: "Soupy", icon: Soup },
                  { label: "Crunchy", icon: Cookie },
                  { label: "Comfort food", icon: Utensils },
                  { label: "Cold & refreshing", icon: Martini },
                  { label: "Fried & crispy", icon: ChefHat },
                  { label: "Refined & upscale", icon: HandPlatter },
                ].map(({ label, icon: Icon }) => {
                  const isSelected = selectedCravingTags.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleCravingTag(label)}
                      className={`flex flex-col items-center justify-center px-2.5 py-2.5 rounded-md border transition text-center ${
                        isSelected
                          ? "bg-white text-black border-white"
                          : "border-white text-white"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.5} className="mb-1" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setUseFlavorCraving(false);
                    setSelectedCravingTags([]);
                  }}
                  className="text-xs underline text-white hover:text-gray-200 transition"
                >
                  ⤺ Back to cuisine selection
                </button>
              </div>
            </>
          )}
        </div>

        <hr className="border-gray-600" />

        {/* Additional Features */}
        <div className="space-y-2">
          <p className="text-[15px] font-bold text-white">Additional Features</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {[...featureOptions, "None"].map((f) => (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-2.5 py-1 text-xs rounded-md border transition min-w-[120px] text-center ${
                  selectedFeatures.includes(f)
                    ? "bg-white text-black"
                    : "border-white text-white"
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
