import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("✅ API HIT: Received a POST request to /api/generateQuestion");

    // Check if request body is valid
    const bodyText = await req.text();
    console.log("📩 Raw Request Body:", bodyText);

    let previousAnswers;
    try {
      previousAnswers = JSON.parse(bodyText);
    } catch (error) {
      console.error("🚨 JSON Parse Error:", error);
      return NextResponse.json({ error: "Invalid JSON format in request" }, { status: 400 });
    }

    console.log("📥 Received API Request - Answers:", previousAnswers);

    const prompt = generatePrompt(previousAnswers);

    console.log("🛠 Sending request to OpenAI...");
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
      console.error("🚨 OpenAI API Error:", response.status, await response.text());
      return NextResponse.json({ error: "OpenAI API Error" }, { status: response.status });
    }

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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 Generates the prompt based on user answers
function generatePrompt(answers) {
  return `Based on the user's previous answers, generate the next food-related question:\n\n${JSON.stringify(answers)}`;
}
