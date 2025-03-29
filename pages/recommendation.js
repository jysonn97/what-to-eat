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
        console.log("🔍 Sending answers to API:", decodedAnswers);

        const res = await fetch("/api/recommendRestaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: decodedAnswers }),
        });

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ FULL GPT Response:", data);
        console.log("✅ data.recommendations:", data.recommendations);

        // ✅ Safe check before setting state
        if (Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        } else {
          console.error("⚠️ GPT returned non-array recommendations:", data.recommendations);
          setRecommendations([]);
        }
      } catch (err) {
        console.error("❌ Error fetching recommendations:", err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [answers]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🍽️ Top Matches for You</h1>

      {loading && <p>⏳ Finding your perfect spot...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p>No matches found. Try adjusting your preferences!</p>
      )}

      <ul style={styles.list}>
        {recommendations.map((place, index) => (
          <li key={index} style={styles.card}>
            <h3>{place.name}</h3>
            <p>{place.description}</p>
            <p>
              ⭐ {place.rating} | 💵 {place.priceLevel || "N/A"} | 📍{" "}
              {place.distance || "Distance not available"}
            </p>
            <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
              View on Google Maps
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "30px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    margin: "10px auto",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  link: {
    display: "inline-block",
    marginTop: "10px",
    color: "#0070f3",
    textDecoration: "underline",
  },
};
