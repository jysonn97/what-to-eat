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
            <div style={styles.headerRow}>
              <h2 style={styles.name}>{index + 1}. {place.name}</h2>
              <span style={styles.rating}>⭐ {place.rating} ({place.reviewCount} reviews)</span>
            </div>

            {place.highlights?.length > 0 && (
              <ul style={styles.highlights}>
                {place.highlights.map((line, i) => (
                  <li key={i} style={styles.bullet}>✅ {line}</li>
                ))}
              </ul>
            )}

            <p><span style={styles.label}>💰 Price:</span> {place.price}</p>
            <p><span style={styles.label}>🍽️ Cuisine:</span> {place.cuisine}</p>
            <p><span style={styles.label}>📍 Distance:</span> {place.distance}</p>

            {place.mapsUrl && (
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
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

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
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
    padding: "25px",
    margin: "20px auto",
    borderRadius: "12px",
    maxWidth: "620px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    textAlign: "left",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  name: {
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  rating: {
    fontSize: "15px",
    color: "#555",
  },
 highlights: {
  margin: "15px 0 10px",
  padding: 0,
  listStyle: "none",
},
bullet: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "6px",
  fontSize: "16px",
},

  },
  label: {
    fontWeight: 600,
  },
  link: {
    display: "inline-block",
    marginTop: "15px",
    color: "#0070f3",
    textDecoration: "underline",
  },
};
