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
          throw new Error("Failed to fetch recommendations.");
        }

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
    <div style={styles.container}>
      <h1 style={styles.heading}>🍽️ Your Top Restaurant Picks</h1>

      {loading && <p>⏳ Finding your perfect match...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p>No matches found. Try different preferences.</p>
      )}

      <ul style={styles.list}>
        {recommendations.map((place, index) => (
          <li key={index} style={styles.card}>
            <h3 style={styles.name}>
              {index + 1}. {place.name}
              <span style={styles.rating}> ⭐ {place.rating} ({place.reviewCount} reviews)</span>
            </h3>

            <p style={styles.description}>{place.description}</p>

            <p><strong>💰 Price:</strong> {place.price}</p>
            <p><strong>🍽️ Cuisine:</strong> {place.cuisine}</p>
            <p><strong>📍 Distance:</strong> {place.distance}</p>

            {place.mapsUrl && (
              <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                View on Google Maps
              </a>
            )}
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
    padding: "24px",
    margin: "16px auto",
    borderRadius: "10px",
    maxWidth: "620px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  name: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  rating: {
    fontSize: "16px",
    fontWeight: "normal",
    marginLeft: "10px",
  },
  description: {
    fontSize: "16px",
    lineHeight: 1.5,
    margin: "12px 0",
  },
  link: {
    display: "inline-block",
    marginTop: "12px",
    color: "#0070f3",
    textDecoration: "underline",
  },
};
