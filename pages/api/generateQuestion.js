export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { previousAnswers } = req.body; // ✅ use req.body directly (DO NOT parse again)
    console.log("📥 Received API Request - Answers:", previousAnswers);

    const prompt = generatePrompt(previousAnswers);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // get full error string
      console.error("❌ OpenAI API Error:", text);
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    console.log("📤 OpenAI Response:", data);

    return res.status(200).json({
      nextQuestion: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("⚠️ API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// 🧠 Prompt Generator
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question.\n\n${JSON.stringify(answers)}`;
}
