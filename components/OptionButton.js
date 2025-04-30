import { Check } from "lucide-react";
import clsx from "clsx";

export default function OptionButton({ option, selected, onClick }) {
  const isSelected = selected.includes(option);

  return (
    <button
      onClick={() => onClick(option)}
      className={clsx(
        "w-full flex items-center justify-between rounded-md px-4 py-2.5 border text-left transition-all duration-200",
        isSelected
          ? "bg-white text-black border-white"
          : "bg-transparent text-white border-white hover:bg-white hover:text-black"
      )}
    >
      <span className="text-sm font-medium">{option}</span>
      {isSelected && <Check className="w-4 h-4" />}
    </button>
  );
}
