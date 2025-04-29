// components/OptionButton.js
export default function OptionButton({ option, selected, onClick }) {
  const isSelected = selected.includes(option);

  return (
    <button
      onClick={() => onClick(option)}
      className={`w-full px-4 py-3 rounded-lg border text-left transition-all duration-150
        ${
          isSelected
            ? "bg-black text-white border-black"
            : "bg-white text-gray-800 border-gray-300 hover:border-black"
        }`}
    >
      {option}
    </button>
  );
}
