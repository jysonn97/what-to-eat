import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query; // Get location from URL
  const [question, setQuestion] = useState("📍 Where are you looking to eat?");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState(location ? [{ question: "Location", answer: location }] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    if (!answer.trim()) {
      setError("📍 Please enter a response.");
      return;
    }

    setLoading(true);
    setError("");
    const updatedAnswers = [...answers, { question, answer }];

    try {
      const response = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: updatedAnswers }),
      });

      const data = await response.json();
      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setAnswers(updatedAnswers);
        setAnswer("");
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`);
      }
    } catch {
      setError("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>{question}</h1>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." />
      {error && <p>{error}</p>}
      <button onClick={handleNext}>{loading ? "Loading..." : "Next"}</button>
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
    backgroundColor: "#fff",
    fontFamily: "'Aptos', sans-serif",
    textAlign: "center",
  },
};
