import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RecommendationPage() {
  const router = useRouter();
  const { answers } = router.query;

  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationText, setLocationText] = useState("");

  useEffect(() => {
    if (!answers) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const decoded = JSON.parse(answers);
        const loc = decoded.find((a) => a.key === "location")?.answer || "";
        setLocationText(loc);

        const res = await fetch("/api/recommendRestaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: decoded }),
        });

        if (!res.ok) throw new Error("Failed to fetch recommendations.");
        const data = await res.json();

        if (Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        } else {
          throw new Error("Invalid recommendation format.");
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

  const current = recommendations[currentIndex];

  const handlePass = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSave = () => {
    if (current) setSaved((prev) => [...prev, current]);
    setCurrentIndex((prev) => prev + 1);
  };

  const generateYelpUrl = (name, loc) =>
    `https://www.yelp.com/search?find_desc=${encodeURIComponent(name)}&find_loc=${encodeURIComponent(loc)}`;

  const generateUberUrl = (name, loc) =>
    `https://www.ubereats.com/search?q=${encodeURIComponent(name)}&pl=${encodeURIComponent(loc)}`;

  return (
    <div className="min-h-screen bg-black text-white font-extralight px-6 py-12">
      <div className="max-w-xl mx-auto space-y-8 text-center">
        <h1 className="text-3xl font-light">Your Restaurant Picks</h1>
        {loading && <p className="text-neutral-400">⏳ Finding great places...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && current && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow space-y-4">
            <h2 className="text-xl font-light">{current.name}</h2>
            <p className="text-sm text-neutral-400">
              ⭐ {Number(current.rating).toFixed(1)} ({current.reviewCount} reviews)
            </p>

            <ul className="text-sm space-y-2 text-left">
              {current.highlights?.map((line, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-green-400">✔️</span>
                  <span>{line.replace(/^✅\s*/, "")}</span>
                </li>
              ))}
            </ul>

            <div className="text-sm text-neutral-300 text-left space-y-1 pt-2">
              <p>💰 <span className="text-white">{current.price}</span></p>
              <p>🍽️ <span className="text-white">{current.cuisine}</span></p>
              <p>📍 <span className="text-white">{current.distance}</span></p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {current.mapsUrl && (
                <a
                  href={current.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-sm border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-black transition"
                >
                  Google Maps
                </a>
              )}
              <a
                href={generateYelpUrl(current.name, locationText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 text-sm border border-pink-400 text-pink-400 rounded hover:bg-pink-400 hover:text-black transition"
              >
                Yelp
              </a>
              <a
                href={generateUberUrl(current.name, locationText)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 text-sm border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition"
              >
                Uber Eats
              </a>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button
                onClick={handlePass}
                className="px-6 py-2 text-sm border border-neutral-600 rounded hover:bg-neutral-700 transition"
              >
                👎 Pass
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-sm border border-white text-white rounded hover:bg-white hover:text-black transition"
              >
                ⭐ Save
              </button>
            </div>
          </div>
        )}

        {!loading && !error && currentIndex >= recommendations.length && (
          <div className="space-y-6">
            <h2 className="text-xl font-light">You're all done!</h2>
            {saved.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">Here’s what you saved:</p>
                <ul className="text-left space-y-2 text-sm">
                  {saved.map((place, idx) => (
                    <li key={idx} className="text-white">• {place.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">You didn’t save any spots.</p>
            )}

            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 text-sm border border-white rounded hover:bg-white hover:text-black transition"
            >
              ⬅ Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
