export default function NavigationButtons({ onBack, onNext, disabled, loading }) {
  return (
    <div className="flex justify-between pt-6">
      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-black transition"
      >
        ← Go Back
      </button>

      <button
        onClick={onNext}
        disabled={disabled || loading}
        className={`px-5 py-2 text-sm rounded-lg font-medium transition duration-150
          ${
            disabled || loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
      >
        {loading ? "Loading..." : "Next →"}
      </button>
    </div>
  );
}
