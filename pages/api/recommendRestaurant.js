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

    // Build Google Places query from answers
    const cuisine = answers.find((a) => a.key === "cuisine")?.answer || "";
    const vibe = answers.find((a) => a.key === "vibe")?.answer || "";
    const budget = answers.find((a) => a.key === "budget")?.answer || "";

    const query = `${cuisine} ${vibe} ${budget} restaurant`.trim();

    const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      locationAnswer
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const locRes = await fetch(locationUrl);
    const locData = await locRes.json();
    const location = locData.results[0]?.geometry?.location;

    if (!location) {
      return res.status(400).json({ error: "Invalid location provided" });
    }

    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&location=${location.lat},${location.lng}&radius=3000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();
    const places = placesData.results?.slice(0, 5) || [];

    // 🔍 Fetch detailed data for GPT to analyze
    const placeDetails = await Promise.all(
      places.map((place) => fetchPlaceDetails(place.place_id))
    );

    // 🧠 Send everything to GPT
    const userContext = answers
      .map((a) => `${a.key}: ${a.answer}`)
      .join("\n");

    const placeContext = placeDetails
      .map((p, i) => {
        return `Restaurant ${i + 1}:\nName: ${p.name}\nRating: ${p.rating}\nPrice: ${p.price_level}\nAddress: ${p.address}\nReviews: ${p.reviews}\n\n`;
      })
      .join("\n");

    const prompt = `Given the user's preferences below, choose the 3 best restaurants and explain why:\n\nUser Preferences:\n${userContext}\n\nRestaurants:\n${placeContext}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const gptReply = completion.choices[0].message.content;

    return res.status(200).json({ recommendations: gptReply });
  } catch (error) {
    console.error("❌ Recommendation API Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
