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
    console.log("📥 Recommendation Request with Answers:", answers);

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
    const rawPlaces = searchData.results?.slice(0, 5) || [];

    const placeDetails = await Promise.all(
      rawPlaces.map((p) => fetchPlaceDetails(p.place_id))
    );

    const userPrefs = answers.map((a) => `${a.key}: ${a.answer}`).join("\n");

    const context = placeDetails
      .map(
        (p, i) => `
Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating} (${p.reviewCount} reviews)
Price: ${p.price_level}
Vibe: ${p.vibe}
Address: ${p.address}
Reviews: ${p.reviews.join(" | ")}
`
      )
      .join("\n");

const prompt = `
You are a smart, detail-oriented restaurant recommendation assistant.

Based on the user's preferences and the restaurant data below, pick the BEST 3 places and explain WHY they are a strong match. You must consider:
- The user's preferred distance, budget, vibe, and occasion.
- Restaurant reviews that mention specific moods, crowd types, date-worthiness, etc.
- Accuracy is crucial — do not recommend places that violate the user's input (e.g. too far, too expensive, wrong vibe).

Only choose restaurants that truly match. If all 5 are bad matches, just return the 2 best ones or even just 1.

🧾 Your output must be valid JSON:
[
  {
    "name": "Restaurant Name",
    "description": "Why it's a great match. Reference the user's preferences and reviews.",
    "rating": 4.6,
    "reviewCount": 582,
    "price": "$$",
    "cuisine": "Japanese",
    "distance": "9 min walk",
    "mapsUrl": "https://maps.google.com/?q=..."
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
    console.log("✅ FULL GPT Response:", gptText);

    let parsed;
    try {
      parsed = JSON.parse(gptText);
    } catch (err) {
      console.warn("⚠️ Invalid response format from GPT:", gptText);
      return res.status(200).json({ error: "Invalid recommendation format" });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (err) {
    console.error("❌ Recommendation API Error:", err);
    return res.status(500).json({ error: "Failed to generate recommendations" });
  }
}
