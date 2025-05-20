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
  const [reservationWanted, setReservationWanted] = useState(false);

  useEffect(() => {
    if (!answers) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const decoded = JSON.parse(answers);
        setLocationText(decoded.find((a) => a.key === "location")?.answer || "");
        setReservationWanted(
          decoded.find((a) => a.key === "reservationWanted")?.answer === "Yes"
        );

        const res = await fetch("/api/recommendRestaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: decoded }),
        });

        const data = await res.json();
        if (Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        } else {
          throw new Error("Invalid recommendation format.");
        }
      } catch (err) {
        console.error("❌ Error:", err.message);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  const current = recommendations[currentIndex];

  const handlePass = () => setCurrentIndex((prev) => prev + 1);
  const handleSave = () => {
    if (current) setSaved((prev) => [...prev, current]);
    setCurrentIndex((prev) => prev + 1);
  };

  const generateYelpUrl = (name, loc, wantsReservation) => {
    const base = `https://www.yelp.com/search?find_desc=${encodeURIComponent(name)}&find_loc=${encodeURIComponent(loc)}`;
    return wantsReservation ? `${base}&attrs=reservation` : base;
  };

  const generateUberUrl = (name, loc) =>
    `https://www.ubereats.com/search?q=${encodeURIComponent(name)}&pl=${encodeURIComponent(loc)}`;

  return (
    <div className="min-h-screen bg-neutral-100 text-black px-4 py-12 flex justify-center font-light">
      <div className="w-full max-w-xl space-y-8 text-center">
        <h1 className="text-2xl font-light">Your Restaurant Picks</h1>
        {loading && <p>⏳ Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && current && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-neutral-300 text-left">
            {current.imageUrl && (
              <img
                src={current.imageUrl}
                alt={current.name}
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">{current.name}</h2>
                <span className="text-sm text-gray-500">
                  ⭐ {Number(current.rating).toFixed(1)} ({current.reviewCount})
                </span>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                {current.highlights?.slice(0, 2).map((line, i) => (
                  <p key={i}>• {line.replace(/^✅\s*/, "")}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-sm text-gray-600">
                <span>📍 {current.distance}</span>
                <span>💰 {current.price}</span>
                <span>🍽️ {current.cuisine}</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {current.mapsUrl && (
                  <a
                    href={current.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
                  >
                    Google Maps
                  </a>
                )}
                <a
                  href={generateYelpUrl(current.name, locationText, reservationWanted)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-sm border border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition"
                >
                  Yelp
                </a>
                <a
                  href={generateUberUrl(current.name, locationText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-sm border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition"
                >
                  Uber Eats
                </a>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <button
                  onClick={handlePass}
                  className="px-5 py-2 text-sm border border-gray-400 text-gray-600 rounded hover:bg-gray-100 transition"
                >
                  👎 Pass
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-sm border border-black text-black rounded hover:bg-black hover:text-white transition"
                >
                  ⭐ Save
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && currentIndex >= recommendations.length && (
          <div className="space-y-6">
            <h2 className="text-xl font-light">You're all done!</h2>
            {saved.length > 0 ? (
              <div className="space-y-3 text-left">
                <p className="text-sm text-gray-500">Saved restaurants:</p>
                <ul className="text-sm text-black space-y-1">
                  {saved.map((place, i) => (
                    <li key={i}>• {place.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">You didn’t save any spots.</p>
            )}
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 text-sm border border-black rounded hover:bg-black hover:text-white transition"
            >
              ⬅ Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
