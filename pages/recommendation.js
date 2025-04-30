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
      <div className="max-w-3xl mx-auto space-y-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extralight text-white">Your Top Restaurant Picks</h1>

        {loading && <p className="text-sm text-white">⏳ Finding your perfect match...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && recommendations.length === 0 && (
          <p className="text-white">No matches found. Try different preferences.</p>
        )}

        <ul className="space-y-8">
          {recommendations.map((place, index) => (
            <li key={index} className="bg-neutral-900 p-6 rounded-xl shadow-lg text-left space-y-4">
              <div className="flex justify-between flex-wrap items-start">
                <h2 className="text-xl font-extralight text-white">
                  {index + 1}. {place.name}
                </h2>
                <span className="text-sm text-neutral-400">
                  ⭐ {Number(place.rating).toFixed(1)} ({place.reviewCount} reviews)
                </span>
              </div>

              {place.highlights?.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {place.highlights
                    .filter((line) => !/walk from your location/i.test(line))
                    .map((line, idx) => {
                      const cleanedLine = line.replace(/^✅|^✔️|^•/, "").trim();
                      return (
                        <li key={idx} className="flex gap-2 items-start text-white">
                          <span className="text-white">✔️</span>
                          <span>{cleanedLine}</span>
                        </li>
                      );
                    })}
                </ul>
              )}

<p className="text-sm text-white">
  <span className="font-medium">💰 Price:</span>{" "}
  <span className="font-extralight">{place.price}</span>
</p>
<p className="text-sm text-white">
  <span className="font-medium">🍽️ Cuisine:</span>{" "}
  <span className="font-extralight">{place.cuisine}</span>
</p>
<p className="text-sm text-white">
  <span className="font-medium">📍 Distance:</span>{" "}
  <span className="font-extralight">{place.distance}</span>
</p>


              {place.mapsUrl && (
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline inline-block pt-2"
                >
                  View on Google Maps
                </a>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-2 text-sm border border-white rounded hover:bg-white hover:text-black transition"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
