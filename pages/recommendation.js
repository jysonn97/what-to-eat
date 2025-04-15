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

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        const data = await res.json();
        setRecommendations(data.recommendations || []);
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
      <h1 style={styles.heading}>Your Top Restaurant Picks</h1>

      {loading && <p style={styles.message}>⏳ Finding your perfect match...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p style={styles.message}>No matches found. Try adjusting your preferences!</p>
      )}

      <ul style={styles.list}>
        {recommendations.map((place, index) => (
          <li key={index} style={styles.card}>
            <h3 style={styles.name}>{place.name}</h3>
            <p style={styles.description}>{place.description}</p>
            <p style={styles.meta}>
              ⭐ {place.rating} | 💵 {place.priceLevel || "N/A"} | 📍{" "}
              {place.distance || "Distance not available"}
            </p>
            <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
              View on Google Maps →
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
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
    textAlign: "center",
  },
  heading: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: "600",
    marginBottom: "24px",
    color: "#1f1f1f",
  },
  message: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "30px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    fontSize: "16px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
  },
  card: {
    backgroundColor: "#fafafa",
    padding: "24px",
    margin: "12px auto",
    borderRadius: "10px",
    maxWidth: "600px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
    textAlign: "left",
  },
  name: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#111",
  },
  description: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#444",
  },
  meta: {
    fontSize: "14px",
    color: "#666",
  },
  link: {
    display: "inline-block",
    marginTop: "12px",
    color: "#000",
    fontWeight: "500",
    textDecoration: "underline",
  },
};
