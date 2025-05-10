import {
  Utensils,
  Hamburger,
  Pizza,
  Bowl,
  Fish,
  Sushi,
  Pepper,
  Drumstick,
  ChefHat
} from "lucide-react";

const cuisineOptions = [
  { label: "Any", icon: null },
  { label: "American", icon: Hamburger },
  { label: "French", icon: ChefHat },       // no croissant, using chef hat
  { label: "Hamburger", icon: Hamburger },
  { label: "Pizza", icon: Pizza },
  { label: "Chinese", icon: Bowl },         // soup fallback
  { label: "Mexican", icon: ChefHat },      // taco/sandwich fallback
  { label: "Seafood", icon: Fish },
  { label: "Japanese", icon: Sushi },
  { label: "Thai", icon: Pepper },
  { label: "Steak", icon: Drumstick }
];

export default function CuisineGrid({ selected, onToggle, small = false }) {
  const handleClick = (label) => {
    if (label === "Any") {
      onToggle(["Any"]);
    } else {
      const filtered = selected.includes("Any")
        ? [label]
        : selected.includes(label)
        ? selected.filter((s) => s !== label)
        : [...selected, label];
      onToggle(filtered);
    }
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${small ? "text-xs" : "text-sm"}`}>
      {cuisineOptions.map(({ label, icon: Icon }) => {
        const isSelected = selected.includes(label);
        return (
          <button
            key={label}
            onClick={() => handleClick(label)}
          className={`flex flex-col items-center justify-center px-2.5 py-2.5 rounded-md border transition text-center ${
              isSelected ? "bg-white text-black border-white" : "border-white text-white"
            }`}
          >
            {Icon && <Icon size={20} strokeWidth={1.5} className="mb-1" />}
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
