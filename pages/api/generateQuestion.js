import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { previousAnswers } = await req.json();
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

    if (!response.ok) {
      const errorText = await response.text(); // Read error message from OpenAI
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
    }

    let data;
    try {
      data = await response.json(); // Ensure JSON parsing
    } catch (jsonError) {
      throw new Error("Failed to parse JSON response from OpenAI.");
    }

    console.log("📤 OpenAI Response:", data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenAI.");
    }

    return NextResponse.json({
      nextQuestion: data.choices[0].message.content || "Error generating question",
    });

  } catch (error) {
    console.error("⚠️ API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
