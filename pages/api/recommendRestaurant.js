import { Configuration, OpenAIApi } from "openai";

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
    console.log("📥 Recommendation Request Answers:", answers);

    const location = answers.find((a) => a.key === "location")?.answer;
    const cuisine = answers.find((a) => a.key === "cuisine")?.answer;
    const vibe = answers.find((a) => a.key === "vibe")?.answer;
    const budget = answers.find((a) => a.key === "budget")?.answer;

    if (!location) {
      console.error("❌ Missing location in answers");
      return res.status(400).json({ error: "Missing location" });
    }

    // 🧠 Let GPT build a better search query
    const gptPrompt = `You are helping a user find a restaurant based on their preferences.
User's location: ${location}
Cuisine: ${cuisine || "Any"}
Vibe: ${vibe || "Any"}
Budget: ${budget || "Any"}

Generate a Google search query that would help find the most suitable restaurant.`

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: gptPrompt }],
    });

    const searchQuery = gptResponse.data.choices[0].message.content;
    console.log("🔍 GPT Search Query:", searchQuery);

    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const googleData = await googleRes.json();
    console.log("📦 Google Places Result:", googleData);

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    const topResults = googleData.results.slice(0, 5).map((place) => ({
      name: place.name,
      description: place.types?.join(", "),
      rating: place.rating,
      priceLevel: place.price_level,
      distance: place.vicinity,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    }));

    return res.status(200).json({ recommendations: topResults });
  } catch (err) {
    console.error("❌ Final Recommendation API Error:", err.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
