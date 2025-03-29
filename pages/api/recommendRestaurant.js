const OpenAI = require("openai");
const fetchPlaceDetails = require("../../lib/fetchPlaceDetails");

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

    if (!location) {
      return res.status(400).json({ error: "Missing location input" });
    }

    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    // Step 1: Google Places Text Search
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(
        location
      )}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    const googleData = await googleRes.json();

    if (!googleData.results || googleData.results.length === 0) {
      return res.status(404).json({ error: "No restaurants found" });
    }

    // Step 2: Fetch Place Details for top 5
    const topPlaces = googleData.results.slice(0, 5);
    const detailedPlaces = await Promise.all(
      topPlaces.map((place) =>
        fetchPlaceDetails(place.place_id, process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
      )
    );

    // Step 3: Send to GPT to rank/filter
    const gptPrompt = `
You are a helpful assistant that selects the BEST restaurant based on user preferences.

User preferences:
${JSON.stringify(answers, null, 2)}

Here are detailed restaurant candidates:
${JSON.stringify(detailedPlaces, null, 2)}

Pick the top 3 restaurants that best match the user's preferences. For each one, return:
- name
- description (summarize why it's a good fit)
- rating
- priceLevel
- distance (if available)
- mapsUrl (link to Google Maps)

Respond in JSON format as an array.
`;

    const gptRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptPrompt }],
    });

    const gptOutput = gptRes.choices?.[0]?.message?.content;

    try {
      const parsed = JSON.parse(gptOutput);
      return res.status(200).json({ recommendations: parsed });
    } catch (err) {
      console.error("❌ GPT output parsing error:", err);
      return res.status(500).json({ error: "GPT response formatting issue" });
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
