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
  Korean: <Soup className="w-4 h-4 text-white" />,
  Japanese: <ChefHat className="w-4 h-4 text-white" />,
  Chinese: <Soup className="w-4 h-4 text-white" />,
  Italian: <Pizza className="w-4 h-4 text-white" />,
  Mexican: <ChefHat className="w-4 h-4 text-white" />,
  American: <Drumstick className="w-4 h-4 text-white" />,
  BBQ: <Drumstick className="w-4 h-4 text-white" />,
  Seafood: <Fish className="w-4 h-4 text-white" />,
  Vegan: <Salad className="w-4 h-4 text-white" />,
  Pizza: <Pizza className="w-4 h-4 text-white" />,
  Default: <Utensils className="w-4 h-4 text-white" />,
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
              "flex flex-col items-center justify-center rounded-lg p-2 border text-sm transition",
              isSelected
                ? "border-white bg-white text-black"
                : "border-neutral-600 hover:border-white text-white"
            )}
          >
            <div className="mb-1">{icon}</div>
            <span className={clsx(isSelected ? "text-black" : "text-white","text-xs")}>
              {cuisine}
            </span>
          </button>
        );
      })}
    </div>
  );
}
