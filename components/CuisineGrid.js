// components/CuisineGrid.js
import React from "react";
import clsx from "clsx";
import {
  Pizza,
  Soup,
  Fish,
  Drumstick,
  Salad,
  Utensils,
  ChefHat,
  IceCream,
  Taco,
  Sandwich,
  Croissant,
  Egg,
  Globe,
} from "lucide-react";

const cuisineIcons = {
  Korean: <Soup className="w-4 h-4 text-white" />,
  Japanese: <ChefHat className="w-4 h-4 text-white" />,
  Chinese: <Egg className="w-4 h-4 text-white" />,
  Thai: <Salad className="w-4 h-4 text-white" />,
  Italian: <Pizza className="w-4 h-4 text-white" />,
  Mexican: <Taco className="w-4 h-4 text-white" />,
  American: <Sandwich className="w-4 h-4 text-white" />,
  French: <Croissant className="w-4 h-4 text-white" />,
  "Middle Eastern": <Drumstick className="w-4 h-4 text-white" />,
  Indian: <Utensils className="w-4 h-4 text-white" />,
  "Open to anything": <Globe className="w-4 h-4 text-white" />,
};

export default function CuisineGrid({ options, selected, onToggle }) {
  const handleSelect = (cuisine) => {
    if (cuisine === "Open to anything") {
      onToggle(["Open to anything"]);
    } else {
      const newSelected = selected.includes(cuisine)
        ? selected.filter((item) => item !== cuisine)
        : [...selected.filter((item) => item !== "Open to anything"), cuisine];
      onToggle(newSelected);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
      {options.map((cuisine) => {
        const isSelected = selected.includes(cuisine);
        const icon = cuisineIcons[cuisine] || <Utensils className="w-4 h-4 text-white" />;
        return (
          <button
            key={cuisine}
            onClick={() => handleSelect(cuisine)}
            className={clsx(
              "flex items-center justify-center gap-2 px-4 py-3 rounded border transition",
              isSelected
                ? "bg-white text-black border-white"
                : "bg-black text-white border-white hover:bg-neutral-900"
            )}
          >
            <span>{icon}</span>
            <span className="text-xs">{cuisine}</span>
          </button>
        );
      })}
    </div>
  );
}
