import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { previousAnswers } = await req.json();
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
    return NextResponse.json({ nextQuestion: data.choices?.[0]?.message?.content || "Error generating question" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
