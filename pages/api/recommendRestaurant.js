import { OpenAI } from "openai";
import fetchPlaceDetails from "@/lib/fetchPlaceDetails";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { answers } = req.body;
    const locationAnswer = answers.find((a) => a.key === "location")?.answer;
    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    const cuisine = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibe = answers.find((a) => a.key === "vibe")?.answer || "";
    const budget = answers.find((a) => a.key === "budget")?.answer || "";
    const distance = answers.find((a) => a.key === "distance")?.answer || "";
    const occasion = answers.find((a) => a.key === "occasion")?.answer || "";
    const hunger = answers.find((a) => a.key === "hunger")?.answer || "";
    const reviewImportance = answers.find((a) => a.key === "review_importance")?.answer || "";

    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationAnswer
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const geoData = await geoRes.json();
    const location = geoData.results[0]?.geometry?.location;
    if (!location) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${location.lat},${location.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const searchData = await searchRes.json();
    const rawPlaces = searchData.results?.slice(0, 10) || [];

    const placeDetails = await Promise.all(
      rawPlaces.map((p) => fetchPlaceDetails(p.place_id, location))
    );

    const restaurantContext = placeDetails
      .map(
        (p, i) => `Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating}
Review Count: ${p.reviewCount}
Price: ${p.price}
Cuisine: ${p.cuisine}
Distance: ${p.distance}
Reviews: ${p.reviews.join(" | ")}`
      )
      .join("\n\n");

    const prompt = `
You are an intelligent restaurant recommendation assistant.

Your job is to analyze real restaurant data and carefully select the best 3 options that match the user's preferences.

User Preferences:
- Location: ${locationAnswer}
- Cuisine: ${cuisine}
- Budget: ${budget}
- Vibe: ${vibe}
- Distance limit: ${distance}
- Occasion: ${occasion}
- Hunger level: ${hunger}
- Review preference: ${reviewImportance}

Restaurant Candidates:
${restaurantContext}

🧠 Carefully read each restaurant's reviews, price, rating, cuisine, and distance.

✅ Prioritize:
- Vibe, occasion, and cuisine first
- Price and rating second
- Distance and hunger as flexible filters

🔍 If the restaurant is an excellent match overall, it's okay if one aspect is slightly off (e.g., 12 min walk instead of 10, 4.4 stars instead of 4.5).

❌ Do NOT include restaurants that clearly mismatch the core preferences (wrong cuisine, extremely far, bad reviews).

Return ONLY the most relevant 1–3 options.

FORMAT (must be a JSON array like below):
[
  {
    "name": "Restaurant Name",
    "description": "Tailored explanation of why this is a great match.",
    "rating": 4.6,
    "reviewCount": 301,
    "price": "$$",
    "cuisine": "Japanese",
    "distance": "9 min walk",
    "mapsUrl": "https://maps.google.com/?q=..."
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const gptText = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(gptText);
    } catch (err) {
      console.warn("⚠️ Invalid GPT format:", gptText);
      return res.status(200).json({ recommendations: [] });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (err) {
    console.error("❌ Recommendation error:", err);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
