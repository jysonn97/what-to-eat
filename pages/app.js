import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Material UI Icons
import BreakfastDiningIcon from "@mui/icons-material/BreakfastDining";
import BrunchDiningIcon from "@mui/icons-material/BrunchDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import IcecreamIcon from "@mui/icons-material/Icecream";
import CelebrationIcon from "@mui/icons-material/Celebration";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ExploreIcon from "@mui/icons-material/TravelExplore";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PublicIcon from "@mui/icons-material/Public";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import PetsIcon from "@mui/icons-material/Pets";
import NightlifeOutlinedIcon from "@mui/icons-material/NightlifeOutlined";
import EcoIcon from "@mui/icons-material/Eco";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import StarRateIcon from "@mui/icons-material/StarRate";

const iconMap = {
  Breakfast: <BreakfastDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  Brunch: <BrunchDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  Lunch: <LunchDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  Dinner: <DinnerDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Snack / Dessert": <IcecreamIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Regular meal": <ChairAltIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Special event (e.g. birthday, graduation)": <CelebrationIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Date / Romantic": <FavoriteIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Business meeting": <BusinessCenterIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Exploring a new place": <ExploreIcon sx={{ color: "#000" }} fontSize="medium" />,
  Alone: <PersonIcon sx={{ color: "#000" }} fontSize="medium" />,
  Friends: <GroupIcon sx={{ color: "#000" }} fontSize="medium" />,
  Family: <FamilyRestroomIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Partner / Date": <FavoriteIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Client / Coworkers": <EmojiPeopleIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Cozy & quiet": <ChairAltIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Trendy & lively": <NightlifeIcon sx={{ color: "#000" }} fontSize="medium" />,
  Romantic: <FavoriteIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Fancy & upscale": <EmojiObjectsIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Casual & fun": <EmojiPeopleIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Doesn't matter": <PublicIcon sx={{ color: "#000" }} fontSize="medium" />,
  "$": <AttachMoneyIcon sx={{ color: "#000" }} fontSize="medium" />,
  "$$": <AttachMoneyIcon sx={{ color: "#000" }} fontSize="medium" />,
  "$$$": <MonetizationOnIcon sx={{ color: "#000" }} fontSize="medium" />,
  "$$$$": <MonetizationOnIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Walking distance (0–10 min)": <DirectionsWalkIcon sx={{ color: "#000" }} fontSize="medium" />,
  "10–30 min by walk or car": <DriveEtaIcon sx={{ color: "#000" }} fontSize="medium" />,
  "More than 30 min": <DriveEtaIcon sx={{ color: "#000" }} fontSize="medium" />,
  Korean: <RiceBowlIcon sx={{ color: "#000" }} fontSize="medium" />,
  Japanese: <RamenDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  Italian: <LocalPizzaIcon sx={{ color: "#000" }} fontSize="medium" />,
  Mexican: <LocalPizzaIcon sx={{ color: "#000" }} fontSize="medium" />,
  American: <LunchDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  Indian: <RamenDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Middle Eastern": <RiceBowlIcon sx={{ color: "#000" }} fontSize="medium" />,
  French: <RamenDiningIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Open to anything": <PublicIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Outdoor seating": <OutdoorGrillIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Good for groups": <GroupIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Vegetarian / Vegan options": <EcoIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Late-night open": <NightlifeOutlinedIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Pet-friendly": <PetsIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Wheelchair accessible": <AccessibilityIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Accepts reservations": <BusinessCenterIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Delivery available": <DriveEtaIcon sx={{ color: "#000" }} fontSize="medium" />,
  None: <PublicIcon sx={{ color: "#000" }} fontSize="medium" />,
  "4.5+ preferred": <StarRateIcon sx={{ color: "#000" }} fontSize="medium" />,
  "At least 4.0": <StarRateIcon sx={{ color: "#000" }} fontSize="medium" />,
  "Anything's fine": <PublicIcon sx={{ color: "#000" }} fontSize="medium" />,
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
