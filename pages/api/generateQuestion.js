export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { previousAnswers } = req.body;
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a food recommendation assistant." },
          { role: "user", content: `Given these answers: ${JSON.stringify(previousAnswers)}, what is the next best question to ask?` },
        ],
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    const nextQuestion = data.choices[0].message.content.trim();

    res.status(200).json({ nextQuestion });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate question" });
  }
}
