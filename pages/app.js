import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Phosphor Icons
import { Egg, Coffee, ForkKnife, IceCream, Briefcase, Heart, Users, MapPin, 
Star, CurrencyDollar, Car, Globe, BowlFood, Pizza, PawPrint, Wheelchair, Calendar, Truck, 
Sun, Moon, Leaf, User } from "@phosphor-icons/react";

const iconMap = {
  Breakfast: <Egg size={24} color="#000" weight="regular" />,
  Brunch: <Coffee size={24} color="#000" weight="regular" />,
  Lunch: <ForkKnife size={24} color="#000" weight="regular" />,
  Dinner: <ForkKnife size={24} color="#000" weight="regular" />,
  "Snack / Dessert": <IceCream size={24} color="#000" weight="regular" />,
  "Regular meal": <ForkKnife size={24} color="#000" weight="regular" />,
  "Special event (e.g. birthday, graduation)": <Calendar size={24} color="#000" weight="regular" />,
  "Date / Romantic": <Heart size={24} color="#000" weight="regular" />,
  "Business meeting": <Briefcase size={24} color="#000" weight="regular" />,
  "Exploring a new place": <MapPin size={24} color="#000" weight="regular" />,
  Alone: <User size={24} color="#000" weight="regular" />,
  Friends: <Users size={24} color="#000" weight="regular" />,
  Family: <Users size={24} color="#000" weight="regular" />,
  "Partner / Date": <Heart size={24} color="#000" weight="regular" />,
  "Client / Coworkers": <Briefcase size={24} color="#000" weight="regular" />,
  "Cozy & quiet": <Sun size={24} color="#000" weight="regular" />,
  "Trendy & lively": <Moon size={24} color="#000" weight="regular" />,
  Romantic: <Heart size={24} color="#000" weight="regular" />,
  "Fancy & upscale": <Star size={24} color="#000" weight="regular" />,
  "Casual & fun": <Users size={24} color="#000" weight="regular" />,
  "Doesn't matter": <Globe size={24} color="#000" weight="regular" />,
  "$": <CurrencyDollar size={24} color="#000" weight="regular" />,
  "$$": <CurrencyDollar size={24} color="#000" weight="regular" />,
  "$$$": <CurrencyDollar size={24} color="#000" weight="regular" />,
  "$$$$": <CurrencyDollar size={24} color="#000" weight="regular" />,
  "Walking distance (0–10 min)": <MapPin size={24} color="#000" weight="regular" />,
  "10–30 min by walk or car": <Car size={24} color="#000" weight="regular" />,
  "More than 30 min": <Car size={24} color="#000" weight="regular" />,
  Korean: <BowlFood size={24} color="#000" weight="regular" />,
  Japanese: <BowlFood size={24} color="#000" weight="regular" />,
  Italian: <Pizza size={24} color="#000" weight="regular" />,
  Mexican: <Pizza size={24} color="#000" weight="regular" />,
  American: <ForkKnife size={24} color="#000" weight="regular" />,
  Indian: <BowlFood size={24} color="#000" weight="regular" />,
  "Middle Eastern": <BowlFood size={24} color="#000" weight="regular" />,
  French: <ForkKnife size={24} color="#000" weight="regular" />,
  "Open to anything": <Globe size={24} color="#000" weight="regular" />,
  "Outdoor seating": <Sun size={24} color="#000" weight="regular" />,
  "Good for groups": <Users size={24} color="#000" weight="regular" />,
  "Vegetarian / Vegan options": <Leaf size={24} color="#000" weight="regular" />,
  "Late-night open": <Moon size={24} color="#000" weight="regular" />,
  "Pet-friendly": <PawPrint size={24} color="#000" weight="regular" />,
  "Wheelchair accessible": <Wheelchair size={24} color="#000" weight="regular" />,
  "Accepts reservations": <Calendar size={24} color="#000" weight="regular" />,
  "Delivery available": <Truck size={24} color="#000" weight="regular" />,
  None: <Globe size={24} color="#000" weight="regular" />,
  "4.5+ preferred": <Star size={24} color="#000" weight="regular" />,
  "At least 4.0": <Star size={24} color="#000" weight="regular" />,
  "Anything's fine": <Globe size={24} color="#000" weight="regular" />,
};

export default function AppPage() {
  const router = useRouter();
  const { location } = router.query;

  const [answers, setAnswers] = useState(location ? [{ key: "location", answer: location }] : []);
  const [questionData, setQuestionData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchNextQuestion([{ key: "location", answer: location }]);
    }
  }, [location]);

  const fetchNextQuestion = async (currentAnswers) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousAnswers: currentAnswers }),
      });
      const data = await res.json();

      if (data.nextQuestion) {
        setQuestionData(data.nextQuestion);
        setSelected([]);
      } else {
        router.push(`/recommendation?answers=${encodeURIComponent(JSON.stringify(currentAnswers))}`);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selected || selected.length === 0 || !questionData?.key) return;

    let answerToSave = selected;
    const isMulti = questionData.key === "specialFeatures";
    if (!isMulti) {
      answerToSave = selected[0];
    }

    const updatedAnswers = [...answers, { key: questionData.key, answer: answerToSave }];

    const isOccasionBusiness = questionData.key === "occasion" && selected.includes("Business meeting");
    if (isOccasionBusiness) {
      updatedAnswers.push({ key: "whoWith", answer: "Client / Coworkers" });
    }

    fetchNextQuestion(updatedAnswers);
    setAnswers(updatedAnswers);
  };

  const handleBack = () => {
    if (answers.length <= 1) {
      router.push("/location");
      return;
    }
    const updated = [...answers];
    updated.pop();
    setAnswers(updated);
    fetchNextQuestion(updated);
  };

  const handleOptionToggle = (option) => {
    const isMulti = questionData.key === "specialFeatures";

    if (isMulti) {
      setSelected((prev) => {
        if (option === "None") return ["None"];
        const filtered = prev.filter((o) => o !== "None");
        return filtered.includes(option)
          ? filtered.filter((o) => o !== option)
          : [...filtered, option];
      });
    } else {
      setSelected([option]);
    }
  };

  const shouldHideQuestion = () => {
    const lastOccasion = answers.find((a) => a.key === "occasion")?.answer;
    const whoWithAnswer = answers.find((a) => a.key === "whoWith")?.answer;

    if (questionData.key === "whoWith" && lastOccasion === "Business meeting") return true;
    if (questionData.key === "partySize" && whoWithAnswer === "Alone") return true;

    return false;
  };

  if (!questionData) return null;
  if (shouldHideQuestion()) {
    handleNext();
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{questionData.question}</h1>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.options}>
        {questionData.options?.map((option, index) => (
          <label key={index} style={styles.optionItem}>
            <input
              type={questionData.key === "specialFeatures" ? "checkbox" : "radio"}
              name="answer"
              value={option}
              checked={selected.includes(option)}
              onChange={() => handleOptionToggle(option)}
              style={styles.radio}
            />
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {iconMap[option]} {option}
            </span>
          </label>
        ))}
      </div>

      <div style={styles.buttons}>
        <button onClick={handleBack} style={styles.backButton}>← Go Back</button>
        <button onClick={handleNext} disabled={!selected.length || loading} style={styles.nextButton}>
          {loading ? "Loading..." : "Next →"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "40px 20px",
    backgroundColor: "#fff",
    color: "#1f1f1f",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 600,
    marginBottom: "40px",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  optionItem: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  radio: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  nextButton: {
    padding: "10px 26px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 26px",
    backgroundColor: "#f1f1f1",
    color: "#000",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};
