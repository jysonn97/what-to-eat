import { OpenAI } from "openai";
import fetchPlaceDetails from "@/lib/fetchPlaceDetails";

// Haversine formula for walking distance
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
    const distancePref = answers.find((a) => a.key === "distance")?.answer || "";

    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    // Step 1: Get user coordinates
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

    // Step 2: Text search for places
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${userLoc.lat},${userLoc.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const searchData = await searchRes.json();
    const rawPlaces = searchData.results?.slice(0, 10) || [];

    // Step 3: Get detailed info and calculate distance
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

        const priceLevelToDollar = {
          1: "$",
          2: "$$",
          3: "$$$",
          4: "$$$$",
        };

        return {
          ...details,
          distance: walkDistance,
          price: priceLevelToDollar[details.price_level] || "N/A",
        };
      })
    );

    const userPrefs = answers.map((a) => `${a.key}: ${a.answer}`).join("\n");
    const context = placeDetails
      .map(
        (p, i) =>
          `Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating}
Review count: ${p.reviewCount}
Price: ${p.price}
Cuisine: ${p.cuisine}
Distance: ${p.distance}
Top Reviews:\n${p.reviews?.join("\n") || ""}
`
      )
      .join("\n");

    // GPT PROMPT
    const prompt = `You are an intelligent restaurant recommendation assistant.

Based on the user's preferences and the restaurant data below, recommend the BEST 3 restaurants. Be accurate and thoughtful.

User Preferences:
${userPrefs}

Restaurant Candidates:
${context}

✅ Format:
[
  {
    "name": "Restaurant Name",
    "rating": 4.6,
    "reviewCount": 312,
    "price": "$$",
    "cuisine": "Japanese",
    "distance": "8 min walk",
    "mapsUrl": "https://maps.google.com/?q=...",
    "highlights": [
      "Cozy, romantic vibe with ambient lighting",
      "Recent review: 'Perfect for a quiet date night'",
      "Within 8-minute walk from user's location"
    ]
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const gptText = completion.choices[0].message.content;
    console.log("✅ GPT Raw Output:", gptText);

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
