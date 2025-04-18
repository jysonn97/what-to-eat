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

const prompt = `You are a smart restaurant recommendation assistant.

Your job is to read the user preferences and match them with the most relevant restaurants based on Google review details.

✅ Your recommendation must:
- Consider vibe, cuisine, price, etc.
- Select 3 best-fitting restaurants from the data.
- Pick and include the most **relevant reviews** (up to 2) for each restaurant that align with user preferences.
- Format output as valid JSON.

Output format:
[
  {
    "name": "Restaurant Name",
    "description": "Why it's a great fit",
    "rating": 4.6,
    "reviewCount": 1402,
    "price": "$$",
    "vibe": "cozy, quiet, good for date night",
    "topReviews": ["Short relevant review 1", "Short relevant review 2"],
    "distance": "12 min walk",
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
