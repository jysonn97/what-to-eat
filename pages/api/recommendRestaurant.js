import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const occasion = answers.find((a) => a.key === "occasion")?.answer || "";

    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    // 🧠 Use GPT to generate a refined search query
    const prompt = `
You are helping someone find the perfect restaurant. Based on their inputs:

- Location: ${locationAnswer}
- Cuisine: ${cuisineAnswer}
- Vibe: ${vibeAnswer}
- Budget: ${budgetAnswer}
- Occasion: ${occasion}

Generate a concise Google-style search query to find the best matching restaurant (e.g., "romantic Italian dinner NYC rooftop").
`;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const refinedQuery = gptResponse.choices[0].message.content.trim();
    console.log("🧠 GPT Search Query:", refinedQuery);

    // 🌐 Google Places API
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        refinedQuery
      )}&location=${encodeURIComponent(
        locationAnswer
      )}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    const topResults = googleData.results.slice(0, 5).map((place) => ({
      name: place.name,
      description: place.types?.join(", "),
      rating: place.rating,
      priceLevel: place.price_level,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));

    return res.status(200).json({ recommendations: topResults });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
