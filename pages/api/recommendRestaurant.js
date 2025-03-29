import fetchPlaceDetails from "../../lib/fetchPlaceDetails";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { answers } = req.body;
    console.log("📥 Recommendation Request with Answers:", answers);

    const locationAnswer = answers.find((a) => a.key === "location")?.answer;
    const cuisineAnswer = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibeAnswer = answers.find((a) => a.key === "vibe")?.answer || "";
    const budgetAnswer = answers.find((a) => a.key === "budget")?.answer || "";

    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    const query = `${cuisineAnswer} ${vibeAnswer} ${budgetAnswer} restaurant`.trim();

    // 1. Search for nearby restaurants using Google Places Text Search
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(
        locationAnswer
      )}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );
    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    // 2. Fetch detailed info for top 5
    const topPlaces = await Promise.all(
      googleData.results.slice(0, 5).map((place) => fetchPlaceDetails(place.place_id))
    );

    // 3. Build GPT prompt
    const prompt = `You are a restaurant recommendation expert. Based on the following user preferences:\n\n${JSON.stringify(
      answers,
      null,
      2
    )}\n\nand these restaurant candidates:\n\n${JSON.stringify(
      topPlaces,
      null,
      2
    )}\n\nPick the top 3 restaurants that best fit the user’s preferences. Return them in this format:\n\n[\n  {\n    name: "",\n    description: "",\n    rating: 4.5,\n    priceLevel: "$$",\n    distance: "10 min walk",\n    mapsUrl: "https://maps.google.com/..."\n  },\n  ...\n]`;

    // 4. Ask GPT to evaluate and filter
    const aiRes = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const gptReply = aiRes.data.choices[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(gptReply);
    } catch (err) {
      console.error("❌ Failed to parse GPT output:", err);
      console.error("GPT Raw Reply:", gptReply);
      return res.status(500).json({ error: "GPT response format error" });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (error) {
    console.error("❌ Final Recommendation API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
