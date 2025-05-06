import {
  Utensils,
  Pizza,
  Soup,
  Salad,
  Drumstick,   // ✅ Only once
  Cake,
  Shrimp,
  Egg,
  Beef,
  Fish,
  Sandwich,
  IceCream,
  Box,         // ✅ instead of Takeout
  Flame,       // ✅ instead of Pepper
  Croissant
} from "lucide-react";


const cuisineOptions = [
  { label: "Korean", icon: Drumstick },
  { label: "Japanese", icon: Fish },
  { label: "Chinese", icon: Soup },
  { label: "Thai", icon: Salad },
  { label: "Italian", icon: Pizza },
  { label: "Mexican", icon: Sandwich },
  { label: "American", icon: Beef },
  { label: "French", icon: Croissant },
  { label: "Indian", icon: Flame },
  { label: "Middle Eastern", icon: Drumstick },
  { label: "Open to anything", icon: Utensils }
];


export default function CuisineGrid({ selected, onToggle }) {
  const handleClick = (label) => {
    if (label === "Open to anything") {
      onToggle(["Open to anything"]);
    } else {
      const filtered = selected.includes("Open to anything")
        ? [label]
        : selected.includes(label)
        ? selected.filter((s) => s !== label)
        : [...selected, label];
      onToggle(filtered);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
      {cuisineOptions.map(({ label, icon: Icon }) => {
        const isSelected = selected.includes(label);
        return (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={flex flex-col items-center justify-center px-3 py-4 rounded-md border transition ${
              isSelected ? "bg-white text-black border-white" : "border-white text-white"
            }}
          >
            <Icon size={20} strokeWidth={1.5} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
