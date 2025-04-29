import { Check } from "lucide-react";
import clsx from "clsx";

export default function OptionButton({ option, selected, onClick }) {
  const isSelected = selected.includes(option);

  return (
    <button
      onClick={() => onClick(option)}
      className={clsx(
        "w-full flex items-center justify-between rounded-lg px-5 py-4 border text-left transition-all duration-200",
        isSelected
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500 hover:bg-neutral-50"
      )}
    >
      <span className="text-[15px] font-medium">{option}</span>
      {isSelected && <Check className="w-4 h-4" />}
    </button>
  );
}
