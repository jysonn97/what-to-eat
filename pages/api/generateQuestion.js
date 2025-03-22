import { questionFlow } from "../../lib/questionFlow";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { previousAnswers } = req.body;
    console.log("📥 Received Answers:", previousAnswers);

    // Extract which questions have already been answered
    const answeredKeys = previousAnswers.map((a) => a.key);

    // Find the next unanswered question
    const nextQuestion = questionFlow.find((q) => !answeredKeys.includes(q.key));

    if (!nextQuestion) {
      return res.status(200).json({ done: true }); // All questions done
    }

    // ✅ Return full next question including options
    return res.status(200).json({
      nextQuestion: {
        key: nextQuestion.key,
        question: nextQuestion.question,
        options: nextQuestion.options || [], // Include options!
      },
    });
  } catch (error) {
    console.error("⚠️ API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
