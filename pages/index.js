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
    background: "linear-gradient(135deg, #ffffff, #f7f8fa)", // Subtle modern gradient
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "50px", // Slightly larger for impact
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#222",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  },
  subheading: {
    fontSize: "20px",
    marginBottom: "32px",
    color: "#555",
    letterSpacing: "0.5px",
  },
  button: {
    fontSize: "18px",
    padding: "14px 30px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50px", // Rounded for a softer look
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0px 4px 12px rgba(0, 123, 255, 0.2)", // Softer button shadow
  },
  buttonHover: {
    backgroundColor: "#0056b3", // Slightly darker blue on hover
    transform: "scale(1.05)", // Slight lift effect
  },
};
