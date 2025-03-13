import Head from "next/head";

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Import Aptos Font */}
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <h1 style={styles.heading}>🍽️ What to Eat?</h1>
      <p style={styles.subheading}>Let’s find the perfect place for you!</p>

      {/* Horizontal Line */}
      <div style={styles.divider}></div>

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
    background: "linear-gradient(135deg, #ffffff, #f7f8fa)", // Subtle gradient
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "50px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#222",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
  },
  subheading: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#555",
    letterSpacing: "0.5px",
  },
  divider: {
    width: "60%", // Adjust the width based on your preference
    height: "2px",
    backgroundColor: "#ddd", // Light gray for a clean look
    margin: "20px 0", // Adds spacing above and below
    borderRadius: "1px",
  },
  button: {
    fontSize: "18px",
    padding: "14px 30px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.2)",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
    transform: "scale(1.05)",
  },
};
