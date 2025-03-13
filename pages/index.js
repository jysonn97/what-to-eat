import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/location"); // Redirects to location selection
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🍽️ What to Eat?</h1>
      <button style={styles.startButton} onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

/* Styling */
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  startButton: {
    fontSize: "18px",
    padding: "12px 24px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
};
