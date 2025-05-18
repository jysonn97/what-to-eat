import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RecommendationPage() {
  const router = useRouter();
  const { answers } = router.query;

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!answers) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");

      try {
        const decodedAnswers = JSON.parse(answers);
        const res = await fetch("/api/recommendRestaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: decodedAnswers }),
        });

        if (!res.ok) throw new Error("Failed to fetch recommendations.");
        const data = await res.json();

        if (Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        } else {
          throw new Error("Invalid recommendation format");
        }
      } catch (err) {
        console.error("❌ Error:", err.message);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  return (
    <div className="min-h-screen bg-black text-white font-extralight px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-light mb-2">Your Top Restaurant Picks</h1>
          {loading && <p className="text-sm text-neutral-400">⏳ Finding your perfect match...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {!loading && !error && recommendations.length === 0 && (
            <p className="text-sm text-neutral-300">No matches found. Try different preferences.</p>
          )}
        </div>

        <ul className="space-y-10">
          {recommendations.map((place, index) => (
            <li
              key={index}
              className="bg-neutral-900 p-6 rounded-2xl shadow-md border border-neutral-800 hover:border-white transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                <h2 className="text-lg sm:text-xl font-light text-white">
                  {index + 1}. {place.name}
                </h2>
                <span className="text-sm text-neutral-400 font-light">
                  ⭐ {Number(place.rating).toFixed(1)} ({place.reviewCount} reviews)
                </span>
              </div>

              {place.highlights?.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm">
                  {place.highlights
                    .filter((line) => !/walk from your location/i.test(line))
                    .map((line, idx) => {
                      const cleanedLine = line.replace(/^✅|^✔️|^•/, "").trim();
                      return (
                        <li key={idx} className="flex gap-2 items-start text-white">
                          <span className="text-green-400">✔️</span>
                          <span>{cleanedLine}</span>
                        </li>
                      );
                    })}
                </ul>
              )}

              <div className="mt-4 space-y-1 text-sm text-neutral-300">
                <p>
                  <span className="text-white font-light">💰 Price:</span>{" "}
                  <span>{place.price}</span>
                </p>
                <p>
                  <span className="text-white font-light">🍽️ Cuisine:</span>{" "}
                  <span>{place.cuisine}</span>
                </p>
                <p>
                  <span className="text-white font-light">📍 Distance:</span>{" "}
                  <span>{place.distance}</span>
                </p>
              </div>

              {place.mapsUrl && (
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm px-4 py-1.5 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-black transition"
                >
                  View on Google Maps
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="mt-10 px-6 py-2 text-sm border border-white rounded hover:bg-white hover:text-black transition"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
