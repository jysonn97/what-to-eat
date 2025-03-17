export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" }); // ✅ Prevents GET requests
  }

  try {
    const { previousAnswers } = req.body;
    if (!previousAnswers) {
      return res.status(400).json({ error: "Missing previous answers" }); // ✅ Error handling
    }

    const prompt = generatePrompt(previousAnswers);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // ✅ Uses Vercel Env Var
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",  // ✅ Uses GPT-4 Turbo
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return res.status(200).json({ nextQuestion: data.choices?.[0]?.message?.content || "Error generating question" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to generate question" });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
