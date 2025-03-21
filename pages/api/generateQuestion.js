export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { previousAnswers } = req.body; // ✅ Use req.body directly
    console.log("📥 Received API Request - Answers:", previousAnswers);

    const prompt = generatePrompt(previousAnswers);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Ensure API Key is correct
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const text = await response.text(); // Get full error response
      console.error("❌ OpenAI API Error:", text);
      return res.status(500).json({ error: text });
    }

    const data = await response.json();
    console.log("📤 OpenAI Response:", data);

    // ✅ Parse OpenAI response for question & answer choices
    const openAiResponse = data.choices[0].message.content;
    const { question, options } = parseOpenAiResponse(openAiResponse);

    return res.status(200).json({
      nextQuestion: question,
      options: options || [], // ✅ Ensure options is always an array
    });

  } catch (error) {
    console.error("⚠️ API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// 🧠 Prompt Generator
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question. 
  Format your response like this:
  
  Question: <Your question here>
  Options:
  - Option 1
  - Option 2
  - Option 3
  - Option 4

  User's Previous Answers: ${JSON.stringify(answers)}`;
}

// 🛠 Function to parse OpenAI response into question & options
function parseOpenAiResponse(response) {
  try {
    const match = response.match(/Question:\s*(.*?)\nOptions:\n([\s\S]*)/);
    if (!match) return { question: response, options: [] };

    const question = match[1].trim();
    const options = match[2].split("\n").map((opt) => opt.replace("- ", "").trim()).filter(Boolean);

    return { question, options };
  } catch (error) {
    console.error("⚠️ Error parsing OpenAI response:", error);
    return { question: response, options: [] };
  }
}
