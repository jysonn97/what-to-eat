export default function NavigationButtons({ onBack, onNext, disabled, loading }) {
  return (
    <div className="flex justify-center items-center gap-6 pt-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm font-extralight text-white opacity-70 hover:opacity-100 transition"
      >
        Back
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={disabled || loading}
        className={`text-sm font-extralight px-4 py-2 rounded-md border transition duration-200
          ${
            disabled || loading
              ? "border-white text-white opacity-30 cursor-not-allowed"
              : "border-white text-white hover:bg-white hover:text-black"
          }`}
      >
        {loading ? "Loading..." : "Next"}
      </button>
    </div>
  );
}
