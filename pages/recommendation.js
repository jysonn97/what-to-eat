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

        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const data = await res.json();
        console.log("✅ Recommendations received:", data);

        if (!Array.isArray(data.recommendations)) {
          throw new Error("Invalid recommendation format");
        }

        setRecommendations(data.recommendations);
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

      <div style={styles.cardContainer}>
        {!loading &&
          !error &&
          recommendations.map((place, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.name}>{place.name}</h2>
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  View ↗
                </a>
              </div>
              <p style={styles.details}>
                {place.cuisine} • {place.priceLevel || "N/A"} • ⭐ {place.rating} • 📍{" "}
                {place.distance || "N/A"}
              </p>
              <p style={styles.description}>{place.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#1f1f1f",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "32px",
    fontWeight: 600,
    marginBottom: "30px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "left",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: "20px",
    fontWeight: 600,
    margin: 0,
  },
  link: {
    fontSize: "14px",
    color: "#0066cc",
    textDecoration: "none",
  },
  details: {
    fontSize: "14px",
    color: "#666",
    margin: "8px 0",
  },
  description: {
    fontSize: "15px",
    lineHeight: 1.5,
    color: "#333",
  },
};
