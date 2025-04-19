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
    const rawPlaces = searchData.results?.slice(0, 10) || [];

    const placeDetails = await Promise.all(
      rawPlaces.map(async (place) => {
        const detail = await fetchPlaceDetails(place.place_id);
        const loc = place.geometry?.location;
        let distance = "N/A";
        if (loc?.lat && loc?.lng) {
          const meters = haversineDistance(userLoc.lat, userLoc.lng, loc.lat, loc.lng) * 1000;
          const mins = Math.round(meters / 80);
          distance = `${mins} min walk`;
        }
        return { ...detail, distance };
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
Tags: ${p.vibeTags.join(", ")}
Recent Reviews: ${p.reviews.join(" | ")}
`
      )
      .join("\n");

    const prompt = `You are a smart restaurant recommendation assistant.

Choose 3 restaurants that best match the user's preferences below.

Each restaurant should have a bullet-style description.

Respond in valid JSON like this:
[
  {
    "name": "Example Restaurant",
    "rating": 4.6,
    "reviewCount": 320,
    "price": "$$",
    "cuisine": "Korean",
    "distance": "8 min walk",
    "mapsUrl": "https://maps.google.com/...",
    "highlights": [
      "✅ Cozy and romantic vibe",
      "✅ Recent review: “Perfect for a quiet date night”",
      "✅ Within 8-minute walk from your location"
    ]
  }
]

User Input:
${userPrefs}

Candidate Restaurants:
${context}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
    console.error("❌ API Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
