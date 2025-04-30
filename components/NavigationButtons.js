export default function NavigationButtons({ onBack, onNext, disabled, loading }) {
  return (
    <div className="flex justify-between items-center pt-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm font-medium text-white opacity-70 hover:opacity-100 transition"
      >
        ← Go Back
      </button>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={disabled || loading}
        className={`text-sm font-medium px-6 py-2.5 rounded-md border transition duration-200
          ${
            disabled || loading
              ? "border-white text-white opacity-30 cursor-not-allowed"
              : "border-white text-white hover:bg-white hover:text-black"
          }`}
      >
        {loading ? "Loading..." : "Next →"}
      </button>
    </div>
  );
}
