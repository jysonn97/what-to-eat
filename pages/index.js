export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🍽️ What to Eat?</h1>
      <p style={styles.subheading}>Let’s find the perfect meal for you!</p>
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
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  subheading: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#555",
  },
  button: {
    fontSize: "20px",
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};
