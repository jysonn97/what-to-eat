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
        model: "gpt-4-turbo", // ✅ GPT-4 Turbo Explicitly Set
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("🟢 GPT API Response:", data); // ✅ Debugging Log

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid GPT response");
    }

    // ✅ Extract next question & options dynamically
    const generatedText = data.choices[0].message.content;
    const [nextQuestion, ...options] = generatedText.split("\n").filter((line) => line.trim() !== "");

    return NextResponse.json({ nextQuestion, options });
  } catch (error) {
    console.error("❌ GPT API Error:", error);
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `
    Based on the user's previous answers, generate the next food-related question.
    Provide 4 options the user can choose from, separated by new lines.

    Previous answers: ${JSON.stringify(answers)}
  `;
}
