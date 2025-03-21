export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = await new Response(req.body).json(); // ✅ Fix: Manually parse JSON
    console.log("📥 Received API Request - Answers:", body);

    const prompt = generatePrompt(body.previousAnswers);

    console.log("🔹 Sending request to OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("❌ OpenAI API Error:", response.status, response.statusText);
      return res.status(response.status).json({ error: `OpenAI API Error: ${response.statusText}` });
    }

    const data = await response.json();
    console.log("📤 OpenAI Response Data:", data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    return res.status(200).json({
      nextQuestion: data.choices[0].message.content || "Error generating question",
    });

  } catch (error) {
    console.error("⚠️ API Error:", error);
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
