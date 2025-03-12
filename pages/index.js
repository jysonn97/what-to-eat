export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🍽️ What to Eat?</h1>
      <p style={styles.subheading}>Let’s find the perfect place for you!</p>
      <button style={styles.button} onClick={() => window.location.href = "/location"}>
        Start
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px", // Increased space between heading & text
    color: "#333",
  },
  subheading: {
    fontSize: "22px", // Slightly bigger for better readability
    marginBottom: "30px", // More space before button
    color: "#555",
  },
  button: {
    fontSize: "20px",
    padding: "14px 28px", // Slightly bigger for a premium feel
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
