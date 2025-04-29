export default function NavigationButtons({ onBack, onNext, disabled, loading }) {
  return (
    <div className="flex justify-between items-center pt-8">
      <button
        onClick={onBack}
        className="text-sm text-neutral-500 hover:text-neutral-800 transition"
      >
        ← Go Back
      </button>

      <button
        onClick={onNext}
        disabled={disabled || loading}
        className={`px-5 py-2 rounded-lg text-sm font-medium transition duration-200
          ${
            disabled || loading
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          }`}
      >
        {loading ? "Loading..." : "Next →"}
      </button>
    </div>
  );
}
