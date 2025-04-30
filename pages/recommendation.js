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
    <div className="min-h-screen bg-black text-white px-4 py-16 font-extralight">
      <h1 className="text-center text-3xl mb-10 font-extralight">Your Top Restaurant Picks</h1>

      {loading && <p className="text-center text-sm opacity-60">⏳ Finding your perfect match...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-center opacity-60">No matches found. Try different preferences.</p>
      )}

      <ul className="space-y-8 max-w-2xl mx-auto">
        {recommendations.map((place, index) => (
          <li key={index} className="border border-white rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <h2 className="text-lg font-semibold">{index + 1}. {place.name}</h2>
              <span className="text-sm text-gray-400">⭐ {place.rating} ({place.reviewCount} reviews)</span>
            </div>

            {place.highlights?.length > 0 && (
              <ul className="space-y-1 text-sm">
                {place.highlights.map((line, idx) => {
                  const cleanedLine = line.replace(/^✅|^✔️|^•/, "").trim();
                  return (
                    <li key={idx} className="flex gap-2 items-start">
                      <span>✔️</span>
                      <span>{cleanedLine}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="text-sm space-y-1">
              <p><span className="font-semibold">💰 Price:</span> {place.price}</p>
              <p><span className="font-semibold">🍽️ Cuisine:</span> {place.cuisine}</p>
              <p><span className="font-semibold">📍 Distance:</span> {place.distance}</p>
            </div>

            {place.mapsUrl && (
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-white underline hover:text-gray-200"
              >
                View on Google Maps
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
