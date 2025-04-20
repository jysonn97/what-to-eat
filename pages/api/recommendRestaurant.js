import { OpenAI } from "openai";
import fetchPlaceDetails from "@/lib/fetchPlaceDetails";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationAnswer
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const geoData = await geoRes.json();
    const userLoc = geoData.results[0]?.geometry?.location;
    if (!userLoc) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${userLoc.lat},${userLoc.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const searchData = await searchRes.json();
    const rawPlaces = searchData.results?.slice(0, 5) || [];

    const placeDetails = await Promise.all(
      rawPlaces.map(async (p) => {
        const details = await fetchPlaceDetails(p.place_id);
        const placeLoc = p.geometry?.location;
        let walkDistance = null;
        if (placeLoc?.lat && placeLoc?.lng) {
          const km = haversineDistance(userLoc.lat, userLoc.lng, placeLoc.lat, placeLoc.lng);
          const minutes = Math.round((km * 1000) / 80);
          walkDistance = `${minutes} min walk`;
        }
        return {
          ...details,
          distance: walkDistance || "N/A",
        };
      })
    );

    // GPT로 보낼 context 최소화
    const context = placeDetails
      .map(
        (p, i) => `Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating}
Cuisine: ${p.cuisine || "Unknown"}
Price: ${p.price_level || "?"}
Distance: ${p.distance}
Top Highlights: ${p.topHighlights.slice(0, 2).join(" | ")}` // 요약
      )
      .join("\n\n");

    const preferences = answers.map((a) => `${a.key}: ${a.answer}`).join("\n");

    const prompt = `
You are a smart restaurant recommendation assistant.

Return the 3 best restaurants based on the user input and brief summaries.

Strict format rules:
- Each restaurant must include exactly 3 bullet highlights.
- Start each bullet with ✅ and 1 space.
- Each bullet must be a full, grammatically correct sentence with normal spacing.
- Avoid mashing words together.
- Respond only in JSON.

User Preferences:
${preferences}

Candidate Restaurants:
${context}

Respond only in JSON:
[
  {
    "name": "Restaurant Name",
    "rating": 4.6,
    "reviewCount": 300,
    "price": "$$",
    "cuisine": "Korean",
    "distance": "6 min walk",
    "mapsUrl": "https://maps.google.com/?q=...",
    "highlights": [
      "✅ Cozy Korean spot with great cocktails.",
      "✅ Just a 6-minute walk from your current location.",
      "✅ Popular for dates and casual dinners."
    ]
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const text = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn("⚠️ GPT output was not valid JSON:", text);
      return res.status(500).json({ error: "Invalid GPT output" });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (err) {
    console.error("❌ Recommend API Error:", err);
    return res.status(500).json({ error: "Recommendation failed" });
  }
}
