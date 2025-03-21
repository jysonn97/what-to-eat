import { NextResponse } from "next/server";

export default async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { previousAnswers } = await req.json();
    console.log("📥 Received API Request - Answers:", previousAnswers);

    const prompt = generatePrompt(previousAnswers);

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
      return NextResponse.json({ error: `OpenAI API Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log("📤 OpenAI Response Data:", data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    return NextResponse.json({
      nextQuestion: data.choices[0].message.content || "Error generating question",
    });

  } catch (error) {
    console.error("⚠️ API Error:", error);
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
