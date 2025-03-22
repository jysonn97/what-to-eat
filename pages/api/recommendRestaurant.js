export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { answers } = req.body;
    console.log("📥 Recommendation Request with Answers:", answers);

    const locationAnswer = answers.find((a) => a.question === "Location")?.answer;
    const cuisineAnswer = answers.find((a) => a.question.includes("cuisine"))?.answer || "";
    const vibeAnswer = answers.find((a) => a.question.includes("vibe"))?.answer || "";
    const budgetAnswer = answers.find((a) => a.question.includes("budget"))?.answer || "";

    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    const query = `${cuisineAnswer} ${vibeAnswer} ${budgetAnswer} restaurant`.trim();

    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(
        locationAnswer
      )}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    // Return top 5 results with basic info
    const topResults = googleData.results.slice(0, 5).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      price_level: place.price_level,
      place_id: place.place_id,
    }));

    return res.status(200).json({ recommendations: topResults });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
