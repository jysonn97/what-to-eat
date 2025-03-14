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
    fontFamily: "Aptos, sans-serif",
    textAlign: "center",
    padding: "0 20px", // Adds some padding for mobile
  },
  title: {
    fontSize: "clamp(28px, 4vw, 40px)", // Responsive font size
    fontWeight: "bold",
    marginBottom: "20px",
  },
  startButton: {
    fontSize: "clamp(16px, 2vw, 20px)", // Responsive button size
    padding: "14px 28px",
    backgroundColor: "#8B5A2B",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(139, 90, 43, 0.2)",
  },
  startButtonHover: {
    backgroundColor: "#6F4221", // Darker brown on hover
    transform: "scale(1.05)", // Slight zoom effect
  },
};
