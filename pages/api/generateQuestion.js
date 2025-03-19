import { NextResponse } from "next/server";

export default async function handler(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // ✅ Correctly parse the request body
    const body = await req.json(); // <-- FIXED: Ensure the request is properly parsed
    const { previousAnswers } = body;
    
    console.log("📥 Received API Request - Answers:", previousAnswers);

    const prompt = generatePrompt(previousAnswers);

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

    const data = await response.json();
    console.log("📤 OpenAI Response:", data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    return NextResponse.json({
      nextQuestion: data.choices[0].message.content || "Error generating question",
    });
  } catch (error) {
    console.error("⚠️ API Error:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
