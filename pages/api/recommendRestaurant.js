export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { answers } = req.body;
    console.log("📥 Recommendation Request with Answers:", answers);

    const locationAnswer = answers.find((a) => a.key === "location")?.answer;
    const cuisineAnswer = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibeAnswer = answers.find((a) => a.key === "vibe")?.answer || "";
    const budgetAnswer = answers.find((a) => a.key === "budget")?.answer || "";

    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    // 🔄 Step 1: Convert address to lat/lng
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationAnswer
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const { lat, lng } = geoData.results[0].geometry.location;

    // 🔍 Step 2: Build smart query
    const query = `${cuisineAnswer} ${vibeAnswer} ${budgetAnswer} restaurant`.trim();
    console.log("🔍 Final Google query:", query);

    // 📍 Step 3: Use Places API with lat/lng
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${lat},${lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    const topResults = googleData.results.slice(0, 5).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      priceLevel: place.price_level,
      placeId: place.place_id,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));

    return res.status(200).json({ recommendations: topResults });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
