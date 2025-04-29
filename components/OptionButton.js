import { Check } from "lucide-react";
import clsx from "clsx";

export default function OptionButton({ option, selected, onClick }) {
  const isSelected = selected.includes(option);

  return (
    <button
      onClick={() => onClick(option)}
      className={clsx(
        "w-full flex items-center justify-between px-5 py-3 rounded-xl border text-left transition-all duration-200",
        isSelected
          ? "bg-black text-white border-black shadow-md"
          : "bg-white text-gray-800 border-gray-300 hover:border-black"
      )}
    >
      <span className="text-base md:text-[17px] font-medium">{option}</span>
      {isSelected && <Check className="w-5 h-5" />}
    </button>
  );
}
