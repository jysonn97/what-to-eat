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

    // ✨ Step 4: Enhance with GPT
    const restaurantSummaries = googleData.results.slice(0, 10).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      priceLevel: place.price_level,
      userRatingsTotal: place.user_ratings_total,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));

    const prompt = `
You are a food concierge assistant helping users find the best restaurant based on their preferences.

User Preferences:
${JSON.stringify(answers, null, 2)}

Nearby Restaurants (from Google):
${JSON.stringify(restaurantSummaries, null, 2)}

Instructions:
1. Select the BEST 3–5 restaurants that most closely match the user’s vibe, cuisine, budget, and situation.
2. Output ONLY a JSON array with the final selected restaurants.
3. Each object should include: name, address, rating, priceLevel, mapsUrl, and a short reason for why it fits.

Respond ONLY with the JSON array. No explanations.
`;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful restaurant recommendation assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const gptData = await gptRes.json();
    let finalRecommendations;

    try {
      finalRecommendations = JSON.parse(gptData.choices[0].message.content);
    } catch (err) {
      console.error("❌ GPT JSON Parse Error:", err);
      return res.status(500).json({ error: "GPT response formatting error" });
    }

    return res.status(200).json({ recommendations: finalRecommendations });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
