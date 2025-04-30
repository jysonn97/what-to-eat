import { Check } from "lucide-react";
import clsx from "clsx";

export default function OptionButton({ option, selected, onClick }) {
  const isSelected = selected.includes(option);

  return (
    <button
      onClick={() => onClick(option)}
      className={clsx(
        "w-[280px] mx-auto flex items-center justify-between border rounded-md px-4 py-2 transition-all duration-200 text-sm",
        isSelected
          ? "bg-white text-black font-semibold"
          : "bg-transparent text-white border-white hover:bg-white hover:text-black"
      )}
    >
      <span className="font-extralight">{option}</span>
      {isSelected && <Check className="w-4 h-4" />}
    </button>
  );
}
