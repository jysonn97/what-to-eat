import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/location");
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

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    fontFamily: "'Inter', sans-serif",
    padding: "0 20px",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#111",
  },
  startButton: {
    padding: "12px 28px",
    fontSize: "18px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
  },
};
