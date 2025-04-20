import { OpenAI } from "openai";
import fetchPlaceDetails from "@/lib/fetchPlaceDetails";

// Haversine formula to estimate walking distance
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
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
    const distancePref = answers.find((a) => a.key === "distance")?.answer || "";

    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    // Step 1: Geocode user location
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

    // Step 2: Text Search from Google Maps
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${userLoc.lat},${userLoc.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const searchData = await searchRes.json();
    const rawPlaces = searchData.results?.slice(0, 10) || [];

    // Step 3: Fetch details + distance
    const placeDetails = await Promise.all(
      rawPlaces.map(async (p) => {
        const details = await fetchPlaceDetails(p.place_id);
        const placeLoc = p.geometry?.location;
        let walkDistance = "N/A";
        if (placeLoc?.lat && placeLoc?.lng) {
          const km = haversineDistance(userLoc.lat, userLoc.lng, placeLoc.lat, placeLoc.lng);
          const minutes = Math.round((km * 1000) / 80);
          walkDistance = `${minutes} min walk`;
        }
        return {
          ...details,
          distance: walkDistance,
        };
      })
    );

    const userPrefs = answers.map((a) => `${a.key}: ${a.answer}`).join("\n");
    const context = placeDetails
      .map(
        (p, i) => `Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating}
Review count: ${p.reviewCount}
Price: ${p.price_level}
Cuisine: ${p.cuisine}
Distance: ${p.distance}
Vibe Tags: ${p.vibeTags?.join(", ")}
Reviews: ${p.reviews?.join(" | ")}
Top Highlights: ${p.topHighlights?.join(" | ")}
Google Maps URL: ${p.mapsUrl}`
      )
      .join("\n\n");

    const prompt = `
You are a smart restaurant recommendation assistant.

Your job is to carefully analyze the real restaurant data below and choose the BEST 3 options for the user, based on their preferences.

NEVER make up fake links. Only use the actual 'Google Maps URL' provided.

Respond in valid JSON format like this:
[
  {
    "name": "Restaurant Name",
    "rating": 4.6,
    "reviewCount": 301,
    "price": "$$",
    "cuisine": "Japanese",
    "distance": "9 min walk",
    "mapsUrl": "https://maps.google.com/?q=...",
    "highlights": [
      "✅ Cozy vibe and great lighting",
      "✅ Recent review: 'Perfect for a quiet date night'",
      "✅ Within 6 min walk"
    ]
  }
]

User Preferences:
${userPrefs}

Restaurant Data:
${context}
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
      console.warn("⚠️ GPT returned invalid JSON:", gptText);
      return res.status(200).json({ error: "Invalid GPT format" });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (err) {
    console.error("❌ Recommendation API Error:", err);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
