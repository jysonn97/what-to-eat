import clsx from "clsx";
import {
  Pizza,
  Soup,
  Fish,
  Drumstick,
  Salad,
  Utensils,
  ChefHat
} from "lucide-react";

const iconMap = {
  Korean: <Soup className="w-5 h-5 text-white" />,
  Japanese: <ChefHat className="w-5 h-5 text-white" />,
  Chinese: <Soup className="w-5 h-5 text-white" />,
  Italian: <Pizza className="w-5 h-5 text-white" />,
  Mexican: <ChefHat className="w-5 h-5 text-white" />,
  American: <Drumstick className="w-5 h-5 text-white" />,
  BBQ: <Drumstick className="w-5 h-5 text-white" />,
  Seafood: <Fish className="w-5 h-5 text-white" />,
  Vegan: <Salad className="w-5 h-5 text-white" />,
  Pizza: <Pizza className="w-5 h-5 text-white" />,
  Default: <Utensils className="w-5 h-5 text-white" />,
};

export default function CuisineGrid({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {options.map((cuisine) => {
        const isSelected = selected.includes(cuisine);
        const icon = iconMap[cuisine] || iconMap.Default;

        return (
          <button
            key={cuisine}
            onClick={() => onToggle(cuisine)}
            className={clsx(
              "flex flex-col items-center justify-center rounded-lg p-3 border text-sm transition",
              isSelected
                ? "border-white bg-white text-black"
                : "border-neutral-600 hover:border-white text-white"
            )}
          >
            <div className="mb-1">{icon}</div>
            <span className={clsx(isSelected ? "text-black" : "text-white")}>
              {cuisine}
            </span>
          </button>
        );
      })}
    </div>
  );
}
