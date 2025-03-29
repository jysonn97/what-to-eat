import { Configuration, OpenAIApi } from "openai";
import fetchPlaceDetails from "@/lib/fetchPlaceDetails";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { answers } = req.body;
    console.log("📥 Recommendation Request with Answers:", answers);

    const location = answers.find((a) => a.key === "location")?.answer;
    const cuisine = answers.find((a) => a.key === "cuisine")?.answer;
    const vibe = answers.find((a) => a.key === "vibe")?.answer;
    const budget = answers.find((a) => a.key === "budget")?.answer;

    if (!location) {
      return res.status(400).json({ error: "Missing location input" });
    }

    const query = `${cuisine || ""} ${vibe || ""} ${budget || ""} restaurant`.trim();

    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(
      location
    )}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const googleRes = await fetch(textSearchUrl);
    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    const top5 = googleData.results.slice(0, 5);
    const placeDetailsResults = await Promise.all(
      top5.map((place) => fetchPlaceDetails(place.place_id))
    );

    // 🔒 FIXED: Prevent .map() error if placeDetailsResults is not an array
    let detailedPlaces = [];
    if (Array.isArray(placeDetailsResults)) {
      detailedPlaces = placeDetailsResults.map((details, i) => ({
        ...details,
        relevanceScore: 1, // default to 1, to be updated by GPT
      }));
    } else {
      console.error("⚠️ placeDetailsResults is not an array:", placeDetailsResults);
      return res.status(500).json({ error: "Invalid data received from place details fetch" });
    }

    // 🧠 Ask GPT to rank the places
    const prompt = `
You are a food-savvy assistant. A user answered the following preferences:

${answers.map((a) => `${a.key}: ${a.answer}`).join("\n")}

Here are restaurant options:
${detailedPlaces
  .map(
    (place, i) => `Restaurant ${i + 1}:
Name: ${place.name}
Rating: ${place.rating}
Price: ${place.price_level}
Cuisine: ${place.cuisine || "N/A"}
Vibe: ${place.vibe || "N/A"}
Reviews: ${place.reviews?.slice(0, 2).join(" | ") || "No reviews"}`
  )
  .join("\n\n")}

Rank the top 3 that best fit the user's preferences. Respond in JSON like:
[
  { "index": 2, "reason": "Perfect vibe and food quality" },
  ...
]
`;

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = JSON.parse(gptResponse.data.choices[0].message.content);
    const final = parsed.map((r) => ({
      ...detailedPlaces[r.index],
      reason: r.reason,
    }));

    return res.status(200).json({ recommendations: final });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
