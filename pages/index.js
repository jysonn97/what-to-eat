export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>What to Eat?</h1>
      <p style={styles.text}>Let’s find the perfect meal for you!</p>
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
    backgroundColor: "#f8f9fa",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  text: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    fontSize: "18px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};
