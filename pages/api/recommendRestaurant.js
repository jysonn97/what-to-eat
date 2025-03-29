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
    const locationAnswer = answers.find((a) => a.key === "location")?.answer;
    const cuisine = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibe = answers.find((a) => a.key === "vibe")?.answer || "";
    const budget = answers.find((a) => a.key === "budget")?.answer || "";

    if (!locationAnswer) {
      return res.status(400).json({ error: "Missing location input" });
    }

    // Construct search query
    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

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

    const candidates = googleData.results.slice(0, 7).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      price_level: place.price_level,
      types: place.types,
    }));

    // 🧠 Use GPT to choose best matches
    const gptPrompt = `
You're a helpful restaurant matchmaker. Based on the user's inputs and the restaurant list, choose the top 3 most relevant options.

User preferences:
${JSON.stringify(answers, null, 2)}

Restaurant candidates:
${JSON.stringify(candidates, null, 2)}

Reply in JSON format like this:
[
  {
    "name": "...",
    "reason": "why this fits the user's preferences",
    "rating": ...,
    "price_level": ...,
    "address": "..."
  }
]
    `.trim();

    const chatRes = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: gptPrompt }],
    });

    const gptReply = chatRes.data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(gptReply);
    } catch (err) {
      console.error("❌ GPT response parsing failed:", gptReply);
      return res.status(500).json({ error: "Failed to parse GPT response." });
    }

    return res.status(200).json({ recommendations: parsed });
  } catch (err) {
    console.error("❌ recommendRestaurant.js error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
