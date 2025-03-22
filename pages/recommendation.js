import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RecommendationPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!router.isReady) return;
      const query = router.query.answers;

      if (!query) return;

      const answers = JSON.parse(decodeURIComponent(query));
      console.log("📦 Final Answers:", answers);

      try {
        const response = await fetch(`/api/recommendRestaurant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        const data = await response.json();
        setRecommendations(data.restaurants || []);
      } catch (err) {
        console.error("❌ Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [router.isReady]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🍽️ Here’s where you should eat:</h1>
      {loading ? (
        <p>⏳ Finding your perfect spot...</p>
      ) : recommendations.length > 0 ? (
        recommendations.map((r, i) => (
          <div key={i} style={styles.card}>
            <h2>{r.name}</h2>
            <p>{r.description}</p>
            <p><strong>Rating:</strong> {r.rating} ⭐</p>
            <p><strong>Price:</strong> {r.price}</p>
            <a href={r.mapUrl} target="_blank" rel="noopener noreferrer">📍 View on Google Maps</a>
          </div>
        ))
      ) : (
        <p>😕 Couldn't find a match. Try adjusting your preferences.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Aptos', sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
