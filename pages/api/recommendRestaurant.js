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

    const location = answers.find((a) => a.key === "location")?.answer;
    const cuisine = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibe = answers.find((a) => a.key === "vibe")?.answer || "";
    const budget = answers.find((a) => a.key === "budget")?.answer || "";
    const distancePref = answers.find((a) => a.key === "distance")?.answer || "";
    const minRating = answers.find((a) => a.key === "minRating")?.answer || "";
    const occasion = answers.find((a) => a.key === "occasion")?.answer || "";
    const hunger = answers.find((a) => a.key === "hunger")?.answer || "";
    const reviewImportance = answers.find((a) => a.key === "review_importance")?.answer || "";

    if (!location) {
      return res.status(400).json({ error: "Missing location input" });
    }

    // Get lat/lng
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const geoData = await geoRes.json();
    const coordinates = geoData.results[0]?.geometry?.location;
    if (!coordinates) {
      return res.status(400).json({ error: "Invalid location input" });
    }

    const searchQuery = `${cuisine} ${vibe} ${budget} restaurant`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      searchQuery
    )}&location=${coordinates.lat},${coordinates.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const places = searchData.results?.slice(0, 15) || [];

    const details = await Promise.all(
      places.map((p) => fetchPlaceDetails(p.place_id, coordinates))
    );

    // Apply filters (rating, price, distance)
    const filtered = details.filter((place) => {
      const meetsRating = !minRating || (place.rating >= parseFloat(minRating));
      const meetsBudget = !budget || (place.price_description === budget);
      const meetsDistance = !distancePref || (place.distanceValue <= distanceToMinutes(distancePref));
      return meetsRating && meetsBudget && meetsDistance;
    });

    if (filtered.length === 0) {
      return res.status(200).json({ recommendations: [] });
    }

    const restaurant_context = filtered
      .map((p, i) => {
        return `Restaurant ${i + 1}:
Name: ${p.name}
Rating: ${p.rating} (${p.reviewCount} reviews)
Price: ${p.price_description}
Cuisine: ${p.cuisine}
Distance: ${p.distanceText}
Address: ${p.address}
Reviews: ${p.reviews.join(" / ")}
Maps URL: ${p.mapsUrl}
`;
      })
      .join("\n");

    const prompt = `You are an intelligent restaurant recommendation assistant.

Your job is to analyze real restaurant data and carefully select the best 3 options that match the user's preferences.

User Preferences:
- Location: ${location}
- Cuisine: ${cuisine}
- Budget: ${budget}
- Vibe: ${vibe}
- Distance limit: ${distancePref}
- Occasion: ${occasion}
- Hunger level: ${hunger}
- Review preference: ${reviewImportance}

Restaurant Candidates:
${restaurant_context}

🧠 Carefully read each restaurant's reviews, price, rating, and vibe.

✅ Recommend ONLY if the restaurant clearly fits the user's intent (e.g., romantic, cozy, under 10 min walk, etc.).

❌ If no place fits well, return fewer than 3 — do not force results.

Format:
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
      console.error("⚠️ Failed to parse GPT response:", gptText);
      return res.status(200).json({ error: "Invalid GPT format" });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

function distanceToMinutes(text) {
  if (!text) return 999;
  if (text.includes("walk")) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 999;
  }
  return 999;
}
