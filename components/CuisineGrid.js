// components/CuisineGrid.js
import React from "react";
import clsx from "clsx";

const CUISINE_OPTIONS = [
  { name: "Korean", icon: "🍲" },
  { name: "Japanese", icon: "🍣" },
  { name: "Chinese", icon: "🥟" },
  { name: "Thai", icon: "🍜" },
  { name: "Italian", icon: "🍕" },
  { name: "Mexican", icon: "🌮" },
  { name: "American", icon: "🍔" },
  { name: "French", icon: "🥖" },
  { name: "Middle Eastern", icon: "🥙" },
  { name: "Indian", icon: "🥘" },
  { name: "Open to anything", icon: "🌀" },
];

export default function CuisineGrid({ selected, onSelect }) {
  const handleSelect = (cuisine) => {
    if (cuisine === "Open to anything") {
      onSelect(["Open to anything"]);
    } else {
      const newSelected = selected.includes(cuisine)
        ? selected.filter((item) => item !== cuisine)
        : [...selected.filter((item) => item !== "Open to anything"), cuisine];
      onSelect(newSelected);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      {CUISINE_OPTIONS.map(({ name, icon }) => {
        const isSelected = selected.includes(name);
        return (
          <button
            key={name}
            onClick={() => handleSelect(name)}
            className={clsx(
              "flex items-center justify-center gap-2 px-4 py-3 rounded border transition",
              isSelected
                ? "bg-white text-black border-white"
                : "bg-black text-white border-white hover:bg-neutral-900"
            )}
          >
            <span className="text-base">{icon}</span>
            <span className="font-medium">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
